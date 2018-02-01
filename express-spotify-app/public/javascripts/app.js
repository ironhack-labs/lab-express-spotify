'use strict'

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
var SpotifyWebApi = require('spotify-web-api-node');

var clientId = 'e6fc9bdb133245bd8babdeabde6c0b4c',
    clientSecret = 'bc934a4b7200455ca7ce5875b7d79411';

app.use(express.static('public'));

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// -- CONFIGURE APP
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// -- ROUTE
app.get('/', (req, res, next) => {
  console.log("test " + req.method, req.path, req.query);
  res.render('search', {title: "Hey", message: "Hello, there"});
});

// RETRIEVE AN ACCESS TOKEN
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


// SEARCH ARTIST
app.get('/search-for-artist', (res,req,next) => {
  res.render('search')
});

app.get('/search-for-artist', (res,req,next) => {
  console.log(req.body);
  if (req.body.artists || req.body.click) {
    res.render('search') 
  }
});

// START APP
app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});