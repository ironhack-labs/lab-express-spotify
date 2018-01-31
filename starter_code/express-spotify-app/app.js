'use strict';

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '9c2ce4fddfab4f0e87443a0af21168f8',
    clientSecret = '89246e43ea7c40cc99ee0335ca320304';

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