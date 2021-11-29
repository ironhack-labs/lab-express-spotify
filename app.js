require('dotenv').config();

const { query } = require('express');
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(err => console.log('Something went wrong when retrieving an access token', err));

// Our routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artist-search', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.nameOfArtist)
        .then(data => {
            const {items} = data.body.artists;
            res.render('artist-search-results', {items});
        })
        .catch(err => console.log('Error while searching artist: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    console.log(req.params);
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            console.log(data.body);
            const {items} = data.body;
            res.render('albums', {items});
        })
        .catch(err => console.log("Something went wrong when getting the Artist's albums ", err));
});

app.get('/tracks/:albumId', (req, res, next) => {
    console.log(req.params);
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            console.log(data.body);
            const {items} = data.body;
            res.render('tracks', {items});
        })
        .catch(err => console.log("Something went wrong when getting the Artist's albums ", err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
