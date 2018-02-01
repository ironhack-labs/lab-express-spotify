'use strict';

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const prettyjson = require('prettyjson');
const SpotifyWebApi = require('spotify-web-api-node');

//configure app
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.use(express.static('public'));
app.set('layaout', 'layouts/main-layout');

// Remember to paste here your credentials
var clientId = 'cc8adf9b41384c29a2957fcc893b1a9c',
clientSecret = 'd1281b3238e74516b8cc1246bea089e3';

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

//routes
app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  let artist = req.body.artist;
  res.render('artists');
});


//start app
app.listen(3002, () => {
  console.log('Easy web dev. 3002!')
});
