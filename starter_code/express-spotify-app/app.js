var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '4368578915a341a5885e02aa3ddf40e4',
    clientSecret = '641c21598af44acf8b10db34f58bbba9';

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