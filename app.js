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
            res.render(`artist-search-results`, {
                data
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistID', (req, res, next) => {
    spotifyApi.getArtistAlbums((req.params).artistID)
        .then(data => {
            res.render(`albums-by-artist`, {
                data
            })
        })
        .catch(err => console.log('An error occured: ', err));
});

app.get('/view-tracks/:album', (req, res, next) => {
    spotifyApi.getAlbumTracks((req.params).album)
        .then(data => {
            res.render(`view-album-tracks`, {
                data
            })
        })
        .catch(err => console.log('An error occured: ', err));
});

app.get('/top-tracks/:artistID', (req, res, next) => {
    spotifyApi.getArtistTopTracks((req.params).artistID, "NL")
        .then(data => {
            res.render(`top-tracks`, {
                data
            })
        })
        .catch(err => console.log('An error occured: ', err));
});


app.get('/new-releases', (req, res, next) => {
    spotifyApi.getNewReleases({
            limit: 10,
            offset: 0,
            country: 'NL'
        })
        .then(function (data) {
            console.log(data.body.albums.items);
            res.render(`new-releases`, {
                data
            })
        })
        .catch(err => console.log('An error occured: ', err));
});


app.listen(PORT, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));