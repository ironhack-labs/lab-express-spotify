
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const prettyjson = require('prettyjson')
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.use(expressLayouts);
app.set('layout', 'main-layout');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

var clientId = '393c7d31b6ec450bba7159ba92f752e4',
    clientSecret = '3d064fdac1674abb8eecbc19ba8d75a3';

var spotifyApi = new SpotifyWebApi({
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
