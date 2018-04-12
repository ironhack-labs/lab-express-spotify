var SpotifyWebApi = require('spotify-web-api-node');

var clientId = 'b15e36f5256b4c158d7b6d8c0e39b826',
    clientSecret = 'c802787ea4ac490facdff0c47edaab7c';

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