var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '1aeb28b4d404496d9ce0937112d74329',
    clientSecret = '6a2ef4050df34a93b457c729040ee6a7';

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
