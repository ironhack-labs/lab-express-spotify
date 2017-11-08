var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '9405011331584417ba9a0019c317448d',
    clientSecret = '9ab4a90804f0435e82ef7fb31893b70c';

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
