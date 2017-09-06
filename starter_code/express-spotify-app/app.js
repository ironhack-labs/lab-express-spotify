const express = require('express');
const bodyParser = require('body-parser');
var SpotifyWebApi = require('spotify-web-api-node');

const app = express();

var clientId = '0c9bde8be5024f2c8526a0cbc6ca92a9',
    clientSecret = 'ef50816d60044452b1421c5bc04d0aad';

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
