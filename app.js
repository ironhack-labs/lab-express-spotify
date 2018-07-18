var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'e00dfbdf2168447e92f1542ee8c3b8b5',
    clientSecret = 'da917f148edb47dfa9776be889c3928c';

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

//packages installed

const express = require('express');
const app = express();
const hbs = require('hbs');

//Iteration 3 Step 1

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');


app.get('/', (req, res, next) => {
  res.render('index', { title: 'GET and POST'});
});