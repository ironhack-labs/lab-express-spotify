'use strict';

const express = require('express');
const app = express();

const expressLayouts = require('express-ejs-layouts');

//configure app
app.use(express.static('public'));
app.use(expressLayouts);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');

//start the app
app.listen(3000, () => {
  console.log('Spotify-Express alive and kicking on port 3000');
});

//SPOTIFY API
var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'd3e0ceeca04246168a2c8cdb000125d1',
    clientSecret = '95d12952b32246849de39bf7936c11a1';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

//Example API use:
// Get Elvis' albums
// spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
//   .then(function(data) {
//     console.log('Artist albums', data.body);
//   }, function(err) {
//     console.error(err);
//   });


//routes
app.get('/', (req, res, next) => {
  //console.log('connection established1!!! ', req.method, req.path, req.query);
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  
  const params = req.query.artist;
  spotifyApi.searchArtists(params, { limit : 10})
  .then(function(results) {
    console.log(req.query);
    console.log('Artist albums', results.body.artists.items[0]);
    const data = {
      artists: results.body.artists.items
    }
    res.render('artists', data);
  }, function(err) {
    console.error(err);
  });


});

app.get('/albums/:artistId', (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi.getArtistAlbums(artistId, { limit : 10})
  .then(function(results) {
    console.log(req.query);
    console.log('Artist albums', results.body.items);
    const data = {
      albums: results.body.items
    }
    res.render('albums', data);
  }, function(err) {
    console.error(err);
  });
});

app.get('/tracks/:albumId', (req, res) => {
  const albumId = req.params.albumId;
  spotifyApi.getAlbumTracks(albumId)
  .then(function(results) {
    console.log(req.query);
    console.log('Artist albums', results.body.items);
    const data = {
      tracks: results.body.items
    }
    res.render('tracks', data);
  }, function(err) {
    console.error(err);
  });
});