'use strict';

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const SpotifyWebApi = require('spotify-web-api-node');

const clientId = '5671f0751b344bb4a545528e01d0d2cd',
    clientSecret = '889c434579144642904151bdf0d6e821';

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
});

//configure app
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.use(express.static('static'));

//routes
app.get('/', (req, res, next) => {
    res.render('index');
});

//start the app
app.listen(3000, () => {
    console.log('Spotify app')
  });