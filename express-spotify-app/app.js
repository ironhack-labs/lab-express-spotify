var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '61174fc8ca5c403a84ecbb20d47b131a',
    clientSecret = '91f38e31ccd24dc18820b515bfcf28d1';

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