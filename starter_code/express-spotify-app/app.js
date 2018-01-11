var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '87f6d727ea40438db933e56f97571f20',
    clientSecret = 'b075e97d5936419cb3d4e07911956ccb';

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
