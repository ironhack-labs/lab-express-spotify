'use strict';

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '1c30624cba6742dcb792991caecae571',
    clientSecret = '746977b1e77240faa9d0d2411c3e0efe';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layouts');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res, next) => {
  res.render('index');
});

app.listen(3050);