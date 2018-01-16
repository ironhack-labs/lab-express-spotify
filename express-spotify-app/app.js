var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '4211834747a8432bbbea0f3f3b72ad0c',
    clientSecret = 'ebed7614f4b540ec90018a8ceb9a7426';

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
