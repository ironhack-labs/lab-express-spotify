const express = require('express');
const app = express();
const hbs = require('hbs');
const morgan = require('morgan');
const path = require('path');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'ca5229943c5341b5bcd9b7455eae2152',
    clientSecret = '8a09a1ba8f5344f39d530a2201d578e2';

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

app.get('/artist', (req, res, next) => {
  let artist = req.query.artist;
  spotifyApi.searchArtists(artist)
    .then(data => {
      res.render('artist', {artist:data.body.artists.items});
    })
    .catch(err => {
      console.log('Something went wrong while searching for the artist!')
    })
});

app.get('/albums/:id', (req, res, next) => {
  let album = req.params.id;
  spotifyApi.getArtistAlbums(album)
  .then(data => {
    console.log(data.body.items)
    res.render('albums', {album:data.body.items});
  })
  .catch(err => {
    console.log('Something went wrong while searching for the album!')
  })
})

app.get('/tracks/:id', (req, res, next) => {
  let albumId = req.params.id;
  spotifyApi.getAlbumTracks(albumId)
  .then(data => {
    console.log(data.body.items)
    res.render('tracks', {tracks:data.body.items});
  })
  .catch(err => {
    console.log('Something went wrong while searching for the tracks!')
  })
})


  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });