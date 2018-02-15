var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '799fc88736004b38b6fbf4a1e2615e75',
    clientSecret = 'b6313b41a5bc4e46b441dd75ffd1d238';

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
