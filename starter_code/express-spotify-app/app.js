var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = '15ba046ee1564552893a8f02b1cd20a6',
    clientSecret = '0b95954231fd4b498671ae3d1ce6bc34';

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