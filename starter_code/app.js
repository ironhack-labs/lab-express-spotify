'use strict'

const express = require('express');
const app = express();
const hbs = require('hbs');



const SpotifyWebApi = require('spotify-web-api-node');

const clientId = '8d628f5b061f45409cdde686279f85a2',
    clientSecret = '5a46fa3876d84df1be1a32cff68aaf8b';

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