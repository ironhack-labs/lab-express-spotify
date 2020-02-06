require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/artist-search", (req, res) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            let artistsData = data.body.artists
            // console.log('The received data from the API: ', artistsData);
            // res.json(artistsData)
            res.render('artist-search-results', artistsData);
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            let artistAlbums = data.body
            // res.json(artistAlbums);
            res.render('albums', artistAlbums);
        })
        .catch(err => console.log('error', err));
});

app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            let albumTracks = data.body
            // res.json(data.body);
            res.render('tracks', albumTracks);
        })
        .catch(err => console.log('error', err));
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));