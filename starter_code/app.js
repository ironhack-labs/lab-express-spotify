const express = require('express');
const app = express();
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
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');
app.set('view engine','ejs');
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
  let myData = request.query.artist;
  spotifyApi.searchArtists(myData).then(function(data) {
    // console.log('Search artists by name', data.body.artists.items);
    artistsArray = data.body.artists.items;
    response.render('artists',{artists: artistsArray});
    next();
  }, function(err) {
    console.error(err);
  });
  });
app.get('/artists/:id', (request, response, next) => {
  let artistId = request.params.id;
  spotifyApi.getArtistAlbums(artistId)
  .then(function(data) {
    let artistAlbums = data.body.items;
    response.render('album', {albums: artistAlbums});
  }, function(err) {
    console.error(err);
  });
  next();
}, function(err) {
  console.error(err);
});
app.get('/album/:id', (request, response, next) => {
  let albumId = request.params.id;
  spotifyApi.getAlbumTracks(albumId)
  .then(function(data) {
    let tracksAlbum = data.body.items;
    response.render('tracks', {tracks: tracksAlbum});
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
