const express = require('express');
const app = express();
const hbs = require('hbs');

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = '68e3087b69a04f129a0eecc1777d261e',
    clientSecret = '071105faded6467ea0342cc0a549d8f0';

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