const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
//const ejsLinter = require('ejs-lint');
const app = express();

app.use(express.static('files'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', __dirname + '/views/layout/layout');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));
//app.use(ejsLinter);

// Remember to paste here your credentials
let clientId = 'e739f9bb9c3b43c7b0eef0016b37f560',
    clientSecret = 'c3195235535944a99dd50cf99d53bec7';

let spotifyApi = new SpotifyWebApi({
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

app.get('/',(req,res)=>{
  res.render('home');
});

app.get('/artists', (req, res) => {
  // Get multiple artists
  let artist = req.query.artist || 'Anderson+.Paak';
  spotifyApi.searchArtists(artist)
    .then(function(data) {
      console.log('Artists information', data.body.artists);
      res.render('artist', {data});
    }, function(err) {
      console.error(err);
    });
});

app.get('/albums', (req, res) => {
  let artistId = req.query.artist || '3jK9MiCrA42lLAdMGUZpwa';
  spotifyApi.getArtistAlbums(artistId, { limit: 50, offset: 0 })
  .then(function(data) {
    console.log('Artist albums', data.body);
    res.render('albums', {data});
  }, function(err) {
    console.error(err);
  });
});

app.get('/tracks', (req, res) => {
  // Get tracks in an album
  let albumId = req.query.album || '73uicPCTt24cmTc9bVaOIp';
  spotifyApi.getAlbumTracks(albumId)
    .then(function(data) {
      console.log(data.body);
      res.render('tracks', {data});
    }, function(err) {
      console.log('Something went wrong!', err);
    });
  });

app.listen(3000, () => {
  console.log('Server running!');
});
