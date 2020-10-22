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
// Iteration 3 Step 1
app.get("/", (req, res, next) => {
  res.render("index")
});

// Iteration 3 Step 2
app.get("/artist-search", (req, res, next) => {
  
  spotifyApi
    .searchArtists(req.query.search)
    .then(data => {
     console.log('The received data from the API: ', data.body);
     // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
     res.render("artist-search-results", {artist: data.body.artists.items})
     
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

// Iteration 4
app.get('/albums/:id', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi.getArtistAlbums(req.params.id)
  .then(function(data) {
    console.log('albums', data.body);
    res.render("albums", {artist: data.body.items})
  }, function(err) {
    console.error(err);
  });
  
});

// Iteration 5
app.get('/tracks/:id', (req, res, next) => {
  // .getAlbumTracks() code goes here
  spotifyApi.getAlbumTracks(req.params.id)
  .then(function(data) {
    console.log('tracks', data.body);
    res.render("tracks", {tracks: data.body.items})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
