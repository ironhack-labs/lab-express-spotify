const express = require('express');
const app = express();
const hbs = require('hbs');

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '3218d9910e094d9d9a465e02c7487f4e',
    clientSecret = '6436a12537084b1d8f03f10cedc153c6';

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