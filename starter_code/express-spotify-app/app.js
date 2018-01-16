const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var SpotifyWebApi = require('spotify-web-api-node');

app.set('layout', 'layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Remember to paste here your credentials
var clientId = '8a6eb262f1bf40a38a1546da056da85b',
    clientSecret = '10626c72457641f08631371dc4d82138';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res, next) => {
    res.render('index');
  });

  app.post('/artists', (req, res, next) => {
    console.log(req.body);
    spotifyApi.searchArtists(req.body.artist)
  .then(function(data) {
    console.log(data.body.artists.items)
    res.render('artists',{ artists: data.body.artists.items, search: req.body.artist});
  }, function(err) {
    console.error(err);
  });
  });

  app.get('/albums/:id', (req, res, next) => {
    console.log(req.params.id);
    spotifyApi.getArtistAlbums(req.params.id)
  .then(function(data) {
    console.log(data.body.items)
    res.render('albums',{ albums: data.body.items});
  }, function(err) {
    console.error(err);
  });
  });

  app.get('/tracks/:id', (req, res, next) => {
    console.log(req.params.id);
    spotifyApi.getAlbumTracks(req.params.id, { limit : 5, offset : 1 })
  .then(function(data) {
    console.log(data.body.items)
    res.render('tracks',{ tracks: data.body.items});
  }, function(err) {
    console.error(err);
  });
  });

app.listen(3000);