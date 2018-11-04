var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = 'c0a7adadfa0f4621a1b6dcd48cff497e',
  clientSecret = 'ecb5de6b2fea43009c0207771ffef195';

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


const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/artists', (req, res) => {
  console.log(req.query)
  // console.log(spotifyApi)
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      // console.log(data.body.artists.items)
      var artists = data.body.artists.items
      // console.log(artists[0].images[0].url)
      res.render('artists', { artists })
    })
    .catch(err => {
      console.log(err)
    })
})

app.get('/albums/:artistId', (req, res) => {
  // console.log(req.params.artistId)
  spotifyApi.getArtistAlbums(req.params.artistId, { limit: 10, offset: 20 })
    .then(data => {
      //console.log(data.body.items)
      var albums = data.body.items
      // console.log(albums)
      res.render('albums', { albums })
    })
    .catch(err => { console.log(err) })
  // console.log("albums", albums)
  // res.render('albums')
})

app.get('/tracks/:albumId', (req, res) => {
  let albumId = req.params.albumId
  console.log(albumId)
  spotifyApi.getAlbumTracks(albumId, { limit: 5, offset: 1 })
    .then(data => {
      var tracks = data.body.items
      res.render('album-tracks', { tracks })
    })
    .catch(err => { console.log(err) })
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
})