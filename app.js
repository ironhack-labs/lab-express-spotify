require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const SpotifyWebApi = require('spotify-web-api-node');

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

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/artist-search', (req, res) => {
    const { artist } = req.query
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            res.render('artist-search-results', { data: data.body.artists.items })
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    const { artistId } = req.params

    spotifyApi
        .getArtistAlbums(artistId)
        .then(function (data) {
            console.log('Artist albums', data.body.items);
            res.render('albums', { data: data.body.items })
        }, function (err) {
            console.log('Something went wrong!', err);
        });

});


// Get tracks in an album
app.get('/tracks/:albumId', (req, res, next) => {
    const { albumId } = req.params

    spotifyApi
        .getAlbumTracks(albumId, { limit: 5, offset: 1 })
        .then(function (data) {
            console.log('Tracks album', data.body);
            res.render('tracks', { data: data.body.items })
        }, function (err) {
            console.log('Something went wrong!', err);
        });

});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
