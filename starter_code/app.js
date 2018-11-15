const express = require('express');
const app = express();
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = 'eff85dc8f83c48a489f0a7d80aaef13e',
    clientSecret = '51d3cf2444aa46e09185b0a59a4dd25e';

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