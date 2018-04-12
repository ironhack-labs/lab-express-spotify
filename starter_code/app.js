const express = require('express');
const hbs = require('hbs');
const app = express();
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');

const clientID = "60e8957408274d35ac3e9e4739ff17c7";
const clientSecret = "068e7f2e990e40238abfb3ff74b31ed2";

const spotifyApi = new SpotifyWebApi({
  clientId: clientID,
  clientSecret: clientSecret
})

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(path.join(__dirname, '/views/partials'));




