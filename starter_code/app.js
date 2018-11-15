const express = require('express');
const app = express();
const hbs = require('hbs');
const path    = require('path');
var SpotifyWebApi = require('spotify-web-api-node');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));


// Remember to paste your credentials here
var clientId = 'eff85dc8f83c48a489f0a7d80aaef13e',
    clientSecret = '51d3cf2444aa46e09185b0a59a4dd25e';

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


app.get('/', (req, res) => {

  res.render('layout')

});

app.get('/artist', (req, res) => {

  const {artist} = req.query;


  spotifyApi.searchArtists(artist)
  .then(data => {
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    console.log(data.artist)
  })
  .catch(err => {
    // ----> 'HERE WE CAPTURE THE ERROR'
    console.log(err)
  })

  res.render('artist')
});


app.listen(3000);


