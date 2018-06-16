var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');
const path = require('path')
const bodyParser = require("body-parser")

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + '/views/partials')


// Remember to paste here your credentials
var clientId = '94238d032c2042c8a1cafd0abf8562ee',
    clientSecret = 'dd0ac5180f774e9d988846d06d5d871f';

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
      let artists = data.body.artists.items
      res.render('artists', {artists});
    })
    .catch(err => {
      console.log(error)
    })
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    let albums = data.body.items;
    res.render('albums', {albums});
  })
  .catch(err => {
    console.log(error)
  })
});

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId) 
  .then(data => {
    let tracks = data.body.items
    console.log(tracks)
    res.render('tracks',{tracks});
  })
  .catch(err => {
    console.log(error)
  })
});


app.listen(3000);