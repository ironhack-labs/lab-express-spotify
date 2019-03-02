const SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = '9eda179a084a413e879daaff8532b69c',
    clientSecret = '800e66c8899c4312807558feeef14b05';

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

module.exports = spotifyApi