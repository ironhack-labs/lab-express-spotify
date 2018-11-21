const SpotifyWebApi = require('spotify-web-api-node');

const apiConfig = require('../config');

const clientId = apiConfig.clientId; 
const clientSecret = apiConfig.clientSecret;

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

module.exports = spotifyApi;

