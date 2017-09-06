var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '65d2f24f139f4ea68ccb40aea7a76c07',
    clientSecret = '44ff32748f8442849ed158c1bbec1c76';

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
