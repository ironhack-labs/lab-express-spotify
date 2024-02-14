// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  module.exports = spotifyApi