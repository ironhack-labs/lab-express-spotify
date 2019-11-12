const SpotifyWebApi = require("spotify-web-api-node");
// require spotify-web-api-node package here:
var Spotify = require('spotify-web-api-js');
var s = new Spotify()


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

  module.exports = spotifyApi