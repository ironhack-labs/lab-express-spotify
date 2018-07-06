const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '5d344242c00646dfb7cc073f3a53c6b2',
    clientSecret = '116fe87af16a441190f15edf487e16e2';

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


//Index Route
router.get('/', (req, res) => {
  res.render('layouts/index');
});

//Artist Route
router.post('/artist', (req, res) => {
  var query = req.body.search;
  spotifyApi.searchArtists(query)
    .then(data => {
      res.render('layouts/artists', data);
    })
    .catch(err => {
      res.send(err);
    });
});

//Album Route
router.get('/albums/:artistId', (req, res) => {
  var artistId = req.params.artistId;

  spotifyApi.getArtistAlbums(artistId)
    .then(data => {
      res.render('layouts/albums', data);
    })
    .catch(err => {
      res.send(err);
    });
});

router.get('/tracks/:albumId', (req, res) => {
  var albumId = req.params.albumId;

  spotifyApi.getAlbumTracks(albumId)
    .then(data => {
      res.render('layouts/tracks', data);
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;