var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = '40e9ba9b5d6f4a01b66d42f2b0faea58',
    clientSecret = 'b4069c910fe84a678a2db2361999ebeb';

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