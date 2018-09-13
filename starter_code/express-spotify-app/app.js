var SpotifyWebApi = require('spotify-web-api-node');


var clientId = 'd4cfe9a7536d4ba8b9dae6f18014a3db',
    clientSecret = 'bf5efbaa96c54e9dba2fa9d3af369873';

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