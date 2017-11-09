var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

// setup
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Remember to paste here your credentials
var clientId = '5b66ed60d18341499c35d00114888647',
    clientSecret = '44b71ea2c33c4a2dbbddca40a2ec99a4';

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

// -- routes
app.get('/', (req, res, next) => {
    res.render('index');
});

app.post('/artists', (req, res) => {
    let artist = req.body.artist; 
 /*    console.log(artist); 
    res.render('artists'); */
    spotifyApi.searchArtists(artist)
    .then(function(data) {
      res.render('artists', data);
    }, function(err) {
      console.error(err);
    });
});

app.get('/albums/:artistId', (req, res) => {
    // code
});

// -- start the server
app.listen(3000);