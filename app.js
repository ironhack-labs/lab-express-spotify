require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Recuperar un token de acceso 
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Algo salió mal al recuperar un token de acceso', error));

// Our routes go here:
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/artist-search', (req, res) => {
    const artist = req.query.artist

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            // res.json(data)
            res.render('artist-search-results', { data })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistID', (req, res) => {
    const artistId = req.params.artistID

    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            // res.json(data)
            res.render('albums', { data })
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get('/tracks/:albumID', (req, res) => {
    const albumId = req.params.albumID

    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            // res.json(data)
            res.render('tracks', { data })
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
