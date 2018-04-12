const SpotifyWebApi = require("spotify-web-api-node");

// Credentials
const clientId = "54133bec225543b6bdfeab601fb7dad5";
const clientSecret = "9fbc77836ef848c99f7946241d56b748";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  });