var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views/layouts');
app.use(express.static(path.join(__dirname, 'public')));

// Remember to paste here your credentials
var clientId = 'd69a5502919441f2bc2f1d3370f4a656',
  clientSecret = '97908085320f433d84a842bde7df9957';

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

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render('artists', {artists: data.body.artists.items});
    })
    .catch(err => {
      console.log('Something went wrong', err);
    })
});


app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      //console.log(data.body)
      res.render('albums', {albums: data.body.items});
    })
    .catch(err => {
      console.log('Something went wrong', err);
    })
});

app.get('/tracks/:artistId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.artistId)
    .then(data => {
      
      res.render('tracks', {tracks: data.body.items});
    })
    .catch(err => {
      console.log('Something went wrong', err);
    })
});




app.listen(3000)