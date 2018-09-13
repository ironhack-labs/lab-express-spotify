const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views/layouts');
app.use(express.static(path.join(__dirname, 'public')));

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '2fe80b97853e438885c3d2e3742c319c',
    clientSecret = '9de5c66899b24e35bc7dbce16da58b62';

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


app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render('artists', {artists: data.body.artists.items});
    })
    .catch(err => {
      console.log('Error!!', err);
    })
});


app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      res.render('albums', {albums: data.body.items});
    })
    .catch(err => {
      console.log('Error!!', err);
    })
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
      res.render('tracks', {tracks: data.body.items});
    })
    .catch(err => {
      console.log('Error!!', err);
    })
});

app.listen(3000);