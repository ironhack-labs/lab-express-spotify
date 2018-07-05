'use strict';

const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const credentials = require('./credentials.js')
const spotifyApi = new SpotifyWebApi({
  clientId: credentials.clientId,
  clientSecret: credentials.clientSecret
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('Spotify client credentials granted successfully')
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });
