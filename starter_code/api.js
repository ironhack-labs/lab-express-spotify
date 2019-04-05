const SpotifyWebApi = require('spotify-web-api-node');

// Remember to insert your credentials here
const clientId = '474b5e2eb7ca4abd9991988d486e9592',
    clientSecret = 'b9f3ecb275ad430d866a78734acaeeb9';

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