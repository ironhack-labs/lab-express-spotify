const express = require('express');
const app = express();
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'df5615f21e0e4e2889190ad025b1d574',
    clientSecret = '0078954882244fb0989c796e0a7fb72a';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});
app.use(expressLayouts);
app.set('layout', __dirname + '/views/layout/main-layout');

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');
app.set('view engine','ejs');
app.use(morgan('dev'));
app.use(express.static('public'));

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (request, response, next) => {
    response.render('index');
    next();
  });

app.get('/artists', (request, response, next) => {
  spotifyApi.searchArtists(request.query.artist).then(function(data) {
    // console.log('Search artists by name', data.body.artists.items);
    artistsArray = data.body.artists.items;
    console.log(artistsArray[0].images[0].url);
    response.render('artists',{artists: artistsArray});
    next();
  }, function(err) {
    console.error(err);
  });
  });
app.get('/artists/:id', (request, response, next) => {
  spotifyApi.getArtistAlbums(request.params.id)
  .then(function(data) {
    response.render('album', {albums: data.body.items});
  }, function(err) {
    console.error(err);
  });
  next();
}, function(err) {
  console.error(err);
});
app.get('/album/:id', (request, response, next) => {
  spotifyApi.getAlbumTracks(request.params.id)
  .then(function(data) {
    response.render('tracks', {tracks: data.body.items});
  }, function(err) {
    console.error(err);
  });
  next();
}, function(err) {
  console.error(err);
});
  // Server Started
  app.listen(3000, () => {
    console.log('My first app listening on port 3000!');
  });
