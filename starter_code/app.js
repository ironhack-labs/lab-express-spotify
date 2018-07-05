'use strict';

const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const credentials = require('./credentials.js');
const spotifyApi = new SpotifyWebApi({
  clientId: credentials.clientId,
  clientSecret: credentials.clientSecret
});
const morgan = require('morgan');

spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('Spotify client credentials granted successfully');
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

// Middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  console.log('Search term: ', req.query.searchTerm);
  spotifyApi.searchArtists(req.query.searchTerm)
    .then(data => {
      console.log(data.body.artists.items[0]);

      res.render('artists', data);
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
      console.log(err);
    });
});

app.get('/albums/:artistId', (req, res) => {
  console.log('artist id:', req.params.artistId);

  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function (data) {
      console.log('Artist albums', data.body);
      res.render('albums', data.body);
    },
    function (err) {
      console.error(err);
    }
  );
});

// Start listening
app.listen(3000);
