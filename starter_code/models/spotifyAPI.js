var SpotifyWebApi = require("spotify-web-api-node");

var apiConfig = require("../config")

var clientId = apiConfig.clientId
var clientSecret = apiConfig.clientSecret

var spotifyApi = new SpotifyWebApi({
clientId: clientId,
clientSecret: clientSecret
})

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);

  }, function(err) {

    console.log('Something went wrong when retrieving an access token', err);
}); 


module.exports = spotifyApi;