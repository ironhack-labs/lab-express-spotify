const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

const app = express();

// Remember to paste here your credentials
const clientId = '3ff47ac5793545818a116067a846c63e',
    clientSecret = 'a8bf9ee73ed749d5a533ee54eab64f42';

const spotifyApi = new SpotifyWebApi({
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

/* Middlewares config */

app.use(express.static('public'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));

app.set('layout', 'layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/* App routes */

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/artists', (req, res) => {
  let artist = req.query.artist;

  spotifyApi.searchArtists(req.body.artist)
    .then(function(data) {
      res.render('artists', {
        artists: data.body.artists.items
      });
    }, function(err) {
      console.log('Something went wrong!', err);
    });
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(function(data) {
      res.render('albums', {
        albums: data.body.items
      });
    }, function(err) {
      console.log('Something went wrong!', err);
    });
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(function(data) {
      res.render('tracks', {
        tracks: data.body.items
      });
    }, function(err) {
      console.log('Something went wrong!', err);
    });
});

app.listen(3000);
