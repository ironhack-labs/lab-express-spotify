var SpotifyWebApi = require('spotify-web-api-node');
var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Remember to paste here your credentials
var clientId = '20160c41f58543b9805c1dc5dcf640e1',
  clientSecret = 'c9ccb36592b8436395e68c7f6149fc02';

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
  next();
})

app.get('/artist', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(function (data) {
      res.render('artist', { name: req.query.artist, songs: data.body.artists.items, href: data.body.artists.href, artists: data });
    }, function (err) {
      console.error(err);
    });
})

app.get('/albums', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.query.id)
    .then(function (data) {
      res.render('albums', { albums: data.body.items });
    }, function (err) {
      console.error(err);
    });
})

app.get('/tracks', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.query.albumId, { limit : 5, offset : 1 })
    .then(function (data) {
      res.render('tracks', { tracks: data.body });
    }), function (err) {
      console.error(err);
    }
})

app.get('/public', (req, res, next) => {
  res.render('')
})

app.listen(3000, () => {
  console.log('server is running!');
})