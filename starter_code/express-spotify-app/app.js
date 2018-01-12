var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '9f275de0ef5045b0bfb690054746a321',
  clientSecret = '611c9cfa2d9d40b4abe2829a7d9f01d5';

var spotifyApi = new SpotifyWebApi({
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

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');

var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');

app.use(
  morgan(`Request Method: :method, Request URL: :url, Response Time: :response-time(ms)`));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/home', (request, res) => {
  res.render('home');
});
app.get('/', (request, res) => {
  res.render('home');
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.post('/home', function (req, res) {
  let artist = req.body.art;
  spotifyApi.searchArtists(artist)
    .then(function (data) {
      res.render('artist', {
        artist: req.body.art,
        data: data.body
      });
    }, function (err) {
      console.error(err);
    });
});


app.get('/artist', (request, res) => {
  // console.log("Hola");
  res.render('artist');
});

app.get('/albums/:artistId', (req, res) => {
  // console.log(req.params);
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(function (data) {
      // console.log(data.body.items[0].artists[0].name);
      
      res.render('albums', {
        data: data.body,
        band:data.body.items[0].artists[0].name
      })
    }, function (err) {
      console.error(err);
    });
});
app.get('/tracks/:albumId', (req, res) => {
  // console.log(req.params.albumId);
  // Get tracks in an album
  spotifyApi.getAlbumTracks(req.params.albumId, {
      limit: 50,
      offset: 1
    })
    .then(function (data) {
      // console.log(data.body.items[0].artists[0].name);
      
      res.render('tracks', {
        data: data.body,
        band:data.body.items[0].artists[0].name
      })
    }, function (err) {
      console.log('Something went wrong!', err);
    });
});

// Server Started
app.listen(3000, () => {
  console.log('Server ONLINE!');
});