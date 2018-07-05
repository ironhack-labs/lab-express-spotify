const SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
const clientId = '4feb3058409047e6964332205d218817',
    clientSecret = '55a2cb19583e464b89aed855f0b3f8a9';

const spotifyApi = new SpotifyWebApi({
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