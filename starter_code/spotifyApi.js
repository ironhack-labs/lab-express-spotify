const SpotifyWebApi = require('spotify-web-api-node');

// setting the spotify-api goes here:
const clientId = '3bf1e2f5b99644338ffca137055cc039',
    clientSecret = 'e58a3dc92f00455c93fd5509abba7db0';

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

module.exports = spotifyApi ;