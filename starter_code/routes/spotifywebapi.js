const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

// setting the spotify-api goes here:
const clientId = 'bee482d7704547abb901940d9ccdb3bd',
  clientSecret = '3b4214af117847289ef58cd2716e5ac9';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  data => {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  err => {
    console.log('Something went wrong when retrieving an access token', err);
  }
);

module.exports = spotifyApi;