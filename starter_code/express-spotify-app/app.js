'use strict';

// declare variables/constants
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node'); /* const */

// create the app
const app = express();

// configure the views
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');

// link public
app.use(express.static(path.join(__dirname, 'public')));

// Remember to paste here your credentials
var clientId = 'ec2df410f1ae4ec3a69b6211a6b1bf18',
  clientSecret = '36abec59775f4e1fa5e01bc25c04db9a';

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

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  res.render('artists');
});

app.listen(4242);
