var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');
var clientId = '3cfc6511516e4613ab9bb7adbc11345c',
    clientSecret = '546d8dfaa8ee437580d3ec908e56bb0a';

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

router.get('/', (req, res) => {
    res.render('index');
})

router.get('/artists', (req, res) => {
    spotifyApi.searchArtists(req.query.name)
    .then(data => {
        console.log(data.body);
        res.render('artists', { data });
    })
    .catch(err => {
      throw err;
    })
})

router.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function(data) {
      console.log('Artist albums', data.body);
      res.render('albums', { data });
    },
    function(err) {
      console.error(err);
    }
  );
})

router.get('/tracks/:songsId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.songsId, { limit : 5, offset : 1 })
  .then(function(data) {
    console.log(data.body);
    res.render('tracks', { data });
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

module.exports = router;