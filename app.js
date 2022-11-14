const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
require("dotenv").config();
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(path.join(__dirname, '/views/partials'))

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrievin an access token', error));

app.get('/', (req, res) =>{
    res.render('home.hbs')
})

app.get('/artist-search', (req, res) => {
    const artistQuery = req.query.some
    spotifyApi
    .searchArtists(artistQuery)
    .then(data => {
        console.log(data.body.artists.items);
        res.render('artistsAlbums.hbs', {artists: data.body.artists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res) => {
    const artistQuery = req.params.id

    spotifyApi
    .getArtistAlbums(artistQuery)
    .then(data => {
    res.render('albums.hbs', {albums: data.body.items})

    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/tracks/:id', (req, res) => {
    const artistQuery = req.params.id

// setting the spotify-api goes here:

spotifyApi
.getAlbumTracks(artistQuery)
.then(data => {
res.render('tracks.hbs', {tracks: data.body.items})
})
.catch(err => console.log('The error while searching artists occurred: ', err));
})

// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
