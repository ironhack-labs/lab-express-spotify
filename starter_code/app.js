var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '6b00779e209047acbd1fde3d1c6fcddb',
    clientSecret = 'f6b9f215473549968e9f286fb9e40a94';

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