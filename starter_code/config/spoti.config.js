const SpotifyWebApi = require('spotify-web-api-node')

// setting the spotify-api goes here:


// Remember to insert your credentials here
const clientId = '25ab3895b3b64d5ab12a89dc682ca9da',
    clientSecret = '2fa0744635ce4ab58eac0fd66da1f403';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('conectado')
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

  module.exports = spotifyApi