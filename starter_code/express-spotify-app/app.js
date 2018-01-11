var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '0b37b3990fed4043a05be442fa3ee3db',
    clientSecret = '0a4c4c84e5cc40539a3dbf00a17a2ef5';

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