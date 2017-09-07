const SpotifyWebApi = require('spotify-web-api-node'),
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express()

// Remember to paste here your credentials
const clientId = 'ebc59619b9874451adf2518d983009c0',
    clientSecret = '60e32fb1773f45cc98aa80d507217460';

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
})

