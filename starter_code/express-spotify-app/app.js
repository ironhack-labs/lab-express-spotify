var SpotifyWebApi = require('spotify-web-api-node');
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var prettyJson = require('prettyjson');
var morgan = require('morgan');

const app = express();

app.listen(3000,() => {
  console.log('Listeninng on port 3000');
});

// Remember to paste here your credentials
var clientId = 'de05d80b9f2540d4a0d51f5344718aee',
  clientSecret = '8dbcbab7f3ef4fa2be5298278f4cf9c3';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });