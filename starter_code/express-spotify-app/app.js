
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('layout', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'a1a8317f63034b68b3a7e660c8bc4365',
    clientSecret = '9ff24729957349f7acf38eb395a7409b';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.get('/',(req,res)=>{
  console.log(req);
  res.render('index');
});

app.get('/artists',(req,res)=>{
  let artistSearch = req.query.artist;
// Search artists whose name contains 'Love'
spotifyApi.searchArtists(artistSearch)
  .then(function(data) {
    // console.log(data.body.artists.items);
    let artistsArray = data.body.artists.items;
    res.render('artists', {artists: artistsArray});
  }, function(err) {
    console.error(err);
    });
  });
  app.get('/artist/:id',(req,res)=>{
    let artistId = req.params.id;
  // Get albums by a certain artist
spotifyApi.getArtistAlbums(artistId)
  .then(function(data) {
    let artistAlbums = data.body.items;
    res.render('artist', {albums: artistAlbums});
    // console.log('Artist albums', data.body);
  }, function(err) {
    console.error(err);
  });
});

app.get('/album/:id',(req,res)=>{
  let albumId = req.params.id;
// Get tracks in an album
spotifyApi.getAlbumTracks(albumId)
  .then(function(data) {
    console.log(data);
    res.render('tracks', {tracks: data.body.items});
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});


// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

// Server Started
app.listen(3000, () => {
  console.log('Server started');
});
