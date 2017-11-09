const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
const clientId = '4855236035c14e3aa8e50e6b78bc74df';
const clientSecret = '98020d9f5957442687195002dd1d0081';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}))

var id = 0;
// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.get("/", (req, res) => {
  res.render('index');
});

app.post("/artist", (req, res) => {
  spotifyApi.searchArtists(req.body.artist)
    .then(function(data) {
      res.render('artist', { artists: data.body.artists.items });
    }, function(err) {
      console.error(err);
    });
});

app.get('/albums', (req, res) => {
  spotifyApi.getArtistAlbums(req.query.id)
    .then(function(data) {
      res.render('albums',  { albums: data.body.items });
    }, function(err) {
      console.error(err);
    });
});


app.get('/tracks', (req, res) => {

  spotifyApi.getAlbumTracks(req.query.albumId, { limit : 5, offset : 1 })
  .then(function(data) {
    res.render('tracks', { tracks: data.body.items });
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});


app.listen(3000, () => {
  console.log("listen");
});
