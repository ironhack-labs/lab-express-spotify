'use strict'
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');

app.set('views', path.join(__dirname,'views/layouts'));
app.set('view engine', 'hbs');

app.get('/', (req, res ,next) => {
  res.render('index');
});

// Remember to paste here your credentials
const clientId = 'a368e904b2664db992d649022e566ffa',
    clientSecret = '9ae8e2873abf43a98c5942c517753df8';

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



app.listen(3000);