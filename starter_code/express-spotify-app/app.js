var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require("path");

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.render('index');
});

//app.get('/artist', (req, res, next) => {
//  res.render('artist');
//});


app.get('/artist', (req, res, next) => {
  
  spotifyApi.searchArtists(req.query.artist)
  .then(data => {
    //console.log(`Search artists by ${artist}`);
    res.render('artist',{
      data: data.body.artists.items
    });
  })
  .catch(err => {
    console.error(err);
  })
});

// Remember to paste here your credentials
var clientId = '9a9f578a60414b5796f080e5627d4b60',
    clientSecret = '08a93041b75c4022a4960ab2f52c82e3';

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

app.listen(3000);