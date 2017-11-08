var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'e739f9bb9c3b43c7b0eef0016b37f560',
    clientSecret = 'c3195235535944a99dd50cf99d53bec7';

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
