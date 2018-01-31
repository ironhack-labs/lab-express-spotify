'use strict'

var SpotifyWebApi = require('spotify-web-api-node');
// Remember to paste here your credentials
var clientId = 'd524db85aef942cfa7cf04d5b1c06fd8',
    clientSecret = '686410a5063b47de99808d74d29dae4b';

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


const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

//configure app
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(expressLayouts);

//index route
app.get('/', (req, res, next) => {
    res.render("index");
});

//artist route
app.get('/artists', (req, res, next) => {
    let artist = req.query.artist;
    spotifyApi.searchArtist(artist).then((data) => {

    });
});

//start app
app.listen(3000, () => {
    console.log('Working!')
  });