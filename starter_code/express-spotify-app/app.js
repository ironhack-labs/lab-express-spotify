var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '0d2e24babe9d44c78868ff575f9dabca',
    clientSecret = '04d1d411a81e439fa709db61fb401f4b';

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