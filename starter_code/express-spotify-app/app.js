var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = 'a913a0df2d6a4085b1a1e52b724e0973',
    clientSecret = '1e64582cf9eb45b2bc010bb08ce5f7ed';

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
