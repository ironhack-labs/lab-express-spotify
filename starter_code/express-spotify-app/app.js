'use strict';

// declarations
const express = require('express');
const hbs = require('hbs');
const path = require('path');

const bodyParser = require('body-parser');

var SpotifyWebApi = require('spotify-web-api-node');

const app = express();

// config views

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));


//Spotify api set up 

// Remember to paste here your credentials
var clientId = 'da7c9c32a9af4896acf02ddf0b8dd115',
    clientSecret = '47a6d8c1348841de80f0bfbcc06f95ef';

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

// middlewares
// app.use(express.static('public'));

// app.use(bodyParser.urlencoded({ extended: true }));

//routes 

app.get('/', (req, res, next) => {
  res.render('index');
});

spotifyApi.searchArtists("Love")
  .then(function(data) {
    console.log('Search artists by "Love"', data.body);
  },
  function(err) {
    console.error(err);
  }
);

app.get("/", (req, res, next) => {
  spotifyApi.searchArtists(req.body)
  .then(data => {
    console.log(data.body)
    const artistData = {data}
    app.get("/artists", (req, res, next) => {
      // res.redirect("/artists/");
    });
  })
  .catch(err => {
    console.log(error); 
  });
  res.redirect("/artists");
});


// start
app.listen(3000, () => console.log('listening at port 3000'));