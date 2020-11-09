const PORT = 3000;
const dotenv = require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get(`/`, (req, res) => {
    res.render(`index`)
});

app.get(`/artist-search`, (req, res, next) => {
    spotifyApi
        .searchArtists((req.query).artist)
        .then(data => {
            const artistList = data.body.artists.items;
            res.render(`artist-search-results`, {
                artistList
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get(`/title-search`, (req, res, next) => {
    spotifyApi
        .searchTracks((req.query).title)
        .then(data => {
            const titleList = data.body.tracks.items;
            res.render(`title-search-results`, {
                titleList
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistID', (req, res, next) => {
    spotifyApi.getArtistAlbums((req.params).artistID)
        .then(data => {
            const artistAlbums = data.body.items;
            res.render(`albums-by-artist`, {
                artistAlbums
            })
        })
        .catch(err => console.log('An error occurred: ', err));
});

app.get('/view-tracks/:album', (req, res, next) => {
    spotifyApi.getAlbumTracks((req.params).album)
        .then(data => {
            const albumTracks = data.body.items;
            res.render(`view-album-tracks`, {
                albumTracks
            })
        })
        .catch(err => console.log('An error occurred: ', err));
});

app.get('/top-tracks/:artistID', (req, res, next) => {
    spotifyApi.getArtistTopTracks((req.params).artistID, "NL")
        .then(data => {
            const topTracks = data.body.tracks;
            res.render(`top-tracks`, {
                topTracks
            })
        })
        .catch(err => console.log('An error occurred: ', err));
});


app.get('/new-releases', (req, res, next) => {
    spotifyApi.getNewReleases({
            limit: 10,
            offset: 0,
            country: 'NL'
        })
        .then(function (data) {
            const newReleases = data.body.albums.items
            res.render(`new-releases`, {
                newReleases
            })
        })
        .catch(err => console.log('An error occurred: ', err));
});


app.listen(PORT, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));