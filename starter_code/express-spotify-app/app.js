var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '51b6cfa62a8e4dbaac541961c9157547',
    clientSecret = '819ff83240744053adad19955560100b';

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
