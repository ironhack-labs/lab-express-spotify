var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const morgan = require('morgan');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  morgan(`dev`));

// Remember to paste here your credentials
var clientId = 'c6e22f9f38664412b6f0cfcdfd5a68cc',
    clientSecret = '96b50d8790fa474b8ccf03ec7d63c839';

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

app.get('/', (req, res, next) => {
  res.render('index'); 
});

app.post('/', (req, res, next) => {
  res.render('artists'); 
});

app.get('/artists', (req, res, next) => {
  var query = req.query.artist;
  
  spotifyApi.searchArtists(query)
  .then(function(data) {
    console.log(`Search artists by ${query}`, data.body);
    console.log(data.body.artists.items[0].images[0]);
    res.render('artists', data.body); 
  }, function(err) {
    console.error(err);
  });  
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
    console.log('Artist albums', data.body);
    res.render('albums', data.body); 
  }, function(err) {
    console.error(err);
  });
});


app.get('/tracks/:albumId', (req, res, next) => {
  
  spotifyApi.getAlbumTracks(req.params.albumId, { limit : 5, offset : 1 })
  .then(function(data) {
    console.log(data.body);
    console.log(data.body.items[0].preview_url)
    res.render('tracks', data.body); 
  }, function(err) {
    console.log('Something went wrong!', err);
  });
  
});


app.listen(3000, () => {
  console.log('My first app listening on port 3000!')
});