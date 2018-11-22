var SpotifyWebApi = require("spotify-web-api-node")

// Hiding credentials
var apiConfig = require("./config")

var spotifyApi = new SpotifyWebApi({
  clientId : apiConfig.clientId,
  clientSecret : apiConfig.clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
})

module.exports = spotifyApi