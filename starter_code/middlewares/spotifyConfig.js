const SpotifyWebApi = require('spotify-web-api-node');

const clientId = 'a98380eb274242c1ab060c00a80d64fa',
    clientSecret = '671095f4380b40d3a1de5513ab01adaf';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

module.exports = spotifyApi