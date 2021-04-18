require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
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
app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artist-search', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            // for (let item of data.body.artists.items) {
            //     if (item.images.length === 0) item.images.push( { url: ''} );
            // }
            res.render('artist-search-results', { results: data.body });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render('albums', { results: data.body });
        })
        .catch(err => console.log('The error while viewing albums occurred: ', err));
});

app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render('tracks', { results: data.body });
        })
        .catch(err => console.log('The error while viewing tracks occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));