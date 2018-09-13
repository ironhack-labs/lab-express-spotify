var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '0e5120d1e41c4cfba15184f7b57cb07b',
    clientSecret = 'e48d192ae4e843da8882ca7f2e3399d6';

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