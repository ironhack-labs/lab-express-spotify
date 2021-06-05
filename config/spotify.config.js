var SpotifyWebApi = require('spotify-web-api-node');

const SpotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
SpotifyApi
  .clientCredentialsGrant()
  .then(data => SpotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

  module.exports = SpotifyApi