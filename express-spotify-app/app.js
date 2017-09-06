var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'a36d34bce1954db1b5b32e164c1ccf43',
    clientSecret = '0315373a3a444091a4314b78759f447c';

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
