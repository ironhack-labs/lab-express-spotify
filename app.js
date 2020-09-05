/* eslint-disable no-console */

require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// setting the spotify-api goes here:
spotifyApi
    .clientCredentialsGrant()
    .then((data) => spotifyApi.setAccessToken(data.body.access_token))
    .catch((error) => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

app.get('/', (req, res) => {
    res.render('main');
});

app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.search)
        .then((str) => {
            res.render('artist-search-results', str.body.artists);
        })
        .catch((error) => console.log(error));
});

app.get('/album-search/:id', (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.id)
        .then((str) => {
            /* console.log(req.params.id); */
            res.render('album-search-results', str.body);
            console.log(str.body);
        })
        .catch((error) => console.log(error));
});

app.get('/track-search/:id', (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.id)
        .then((str) => {
            /* console.log(req.params.id); */
            res.render('track-search-results', str.body);
            console.log(str.body);
        })
        .catch((error) => console.log(error));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
