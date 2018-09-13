var SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const app = express();
const hbs = require('hbs');

// Remember to paste here your credentials
var clientId = '9cf4f5c16fe74e5a9eafdbfbc329850c',
    clientSecret = 'b3c42c37c54440afaea0abe5d5e6c71e';

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