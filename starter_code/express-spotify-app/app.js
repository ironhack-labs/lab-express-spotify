const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const prettyjson = require('prettyjson');

// Express server handling requests and responses
const app = express();

app.use(expressLayouts);
app.set('layout', 'main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(morgan('dev'));
app.listen(3000);

// My credentials:
const clientId = '2e99a7bf2af347c1a21b1ec96e578658';
const clientSecret = 'c4065fa08f3f4f20bd000f0613fda3b5';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  });
