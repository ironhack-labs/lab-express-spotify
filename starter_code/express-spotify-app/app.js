const express = require('express');
const app = express();
const hbs = require('hbs');

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'b55518b95e334e1aa2d2495b3867ae55',
    clientSecret = '673af2f0c83a4eda81f1441acf0da72b';

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