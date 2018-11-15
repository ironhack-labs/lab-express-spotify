const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser');
const path = require("path");
var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = '2e19c6db067145da9abb5614ec71c3f3',
    clientSecret = 'df21b409c3ea424bb3523dba80458f43';

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

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res, next) => {
    res.render('index');
  });
  
  app.get('/artist', (req, res, next) => {
  spotifyApi.searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
  .then(data => {
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => {
    // ----> 'HERE WE CAPTURE THE ERROR'
  })

});

  app.listen(3000);