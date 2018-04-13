'use strict';

const path = require('path');
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');

// create the app
const app = express();

// configure views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Parse body
app.use(bodyParser.urlencoded({ extended: true }));

// Remember to paste here your credentials
const clientId = '56e6c681cd8d474fb18d5be29ca070ce';
const clientSecret = '10d223d5f1724fdea049eaf297f1eb41';

const spotifyApi = new SpotifyWebApi({
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

// Routes
app.get('/', (req, res, next) => {
  res.render('search');
});

app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query)
    .then(result => {
      const data = {
        artists: result.body
      };
      // console.log(result, result.body);
      res.render('artists', data);
    })
    .catch(err => {
      console.log(err);
    });
});

// start server
app.listen(3000, () => console.log('woooooo 3000'));
