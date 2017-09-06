/*jshint esversion:6*/
const express = require('express');
const _ = require('lodash');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

const app = express();


var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '1c30624cba6742dcb792991caecae571',
    clientSecret = '746977b1e77240faa9d0d2411c3e0efe';

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

app.get('/artist', (req,res) =>{
  res.render('main.ejs');
});


// Server Started
let port = 3000;
app.listen(port, () => {
});
