var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '545c564be843429eb66527d7fd4d0d31',
    clientSecret = 'e0e7e7b9ddae4735bf6ba6ae204a67e5';

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
