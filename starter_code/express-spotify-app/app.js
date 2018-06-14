const express = require('express');
const app = express();
const hbs = require('hbs');
const path    = require('path');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '0f4f1913aa8d420782ea4cbd6ff38709',
    clientSecret = '9309acbc7f884a439d1c85e5ee166ced';

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


app.get('/', function (req, res) {
  res.render('index');
})

app.get('/artists', function (req, res) {
  // console.log(req.query);
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      let artistInfo = data.body.artists.items;
      res.render('artists', {artistInfo});
      // console.log(artistInfo[0]);
    })
    .catch(err => {
      console.log(error);
    })
})

app.get('/albums/:artistId', (req, res) => {
  // console.log(req.params.artistId);
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      let albumInfo = data.body.items;
      res.render('albums', {albumInfo});
      // console.log(albumInfo);
    })
    .catch(err => {
      console.log(error);
    })
});

app.get('/tracks/:artistId', (req, res) => {
  // console.log(req.params.artistId);
  spotifyApi.getAlbumTracks(req.params.artistId)
    .then(data => {
      let trackInfo = data.body.items;
      res.render('tracks', {trackInfo});
      console.log(trackInfo);
    })
    .catch(err => {
      console.log(error);
    })
});

app.listen(3000, () => console.log('Spotify app listening on port 3000!'))