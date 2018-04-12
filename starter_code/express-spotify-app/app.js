const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');

const app = express();

// Remember to paste here your credentials
const clientId = '3bf666e055684c42bc6eaa9789b34e37',
    clientSecret = '578bb2451be04f34aa57767599d67f86';

const spotifyApi = new SpotifyWebApi({
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