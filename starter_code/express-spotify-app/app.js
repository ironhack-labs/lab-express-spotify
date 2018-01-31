'use strict';
// Packages needed
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');

// Setting up express
const app = express();
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Setting up layout and static folder
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Setting up spotify API
const clientId = 'ac04c9ea706c4b838ae1c3191c5068ab';
const clientSecret = 'fc634d062eef4e2690aff150e85e5e68';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi.clientCredentialsGrant().then(
  function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);

// Routes

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/artists', (req, res) => {
  let artistSearched = req.body.artist;
  spotifyApi.searchArtists(artistSearched).then(function (data) {
    res.render('lists', {data: data.body.artists.items });
  }, function (err) {
    console.error(err);
  });
});

app.get('/albums/:artistId', (req, res) => {
  let artistId = req.params.artistId;
  spotifyApi.getArtistAlbums(artistId).then(function (data) {
    res.render('lists', { data: data.body.items });
  }, function (err) {
    console.error(err);
  });
});

// Start the server
app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
