var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');

var clientId = '93310b5ff2814ab6869fd23d309cdf22',
  clientSecret = '92b44cc35e5a4e75a3b6b2dbae2a0770';

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function (data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/artists', function (req, res, next) {
  // Search tracks whose name, album or artist contains 'Love'
  spotifyApi.searchArtists(req.body.artistSearch)
    .then(function (data) {
      res.render('artists', {data, artistSearch: req.body.artistSearch})
    }, function (err) {
      console.error(err);
    });
});

router.get('/albums/*', (req,res) => {
  spotifyApi.getArtistAlbums(req.params[0])
  .then(function(data) {
    res.render('albums', {data})
  }, function(err) {
    console.error(err);
  });
})

router.get('/tracks/*', (req,res) => {
  spotifyApi.getAlbumTracks(req.params[0])
  .then(function(data) {
    
    res.render('tracks', {data})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

module.exports = router;