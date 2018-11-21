const express = require('express');
const router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');

const apiConfig = require('../config');

var clientId = apiConfig.clientId,
  clientSecret = apiConfig.clientSecret

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
  res.render('home', {layout: "firstPage"});
});

router.post('/', (req, res) => {
  spotifyApi.searchArtists(req.body.searchArtist)
  .then(function(data) {
    res.render('artists', {data: data.body.artists.items});
  }, function(err) {
    console.error(err);
  });
})

router.get('/albums/:artistId', (req, res) => {
  let artisId = req.params.artistId;

  spotifyApi.getArtistAlbums(artisId)
  .then(function(data) {
      res.render('albums', {album: data.body.items});
    } , function(err) {
      console.error(err);
  });
});


router.get('/albums/tracks/:albumId', (req, res) => {
  let albumName = req.query.albumName;
  let albumId = req.params.albumId;
  
  spotifyApi.getAlbumTracks(albumId)
  .then(function(data) {
    
    res.render('tracks', {album: data.body.items, albumName: albumName});
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

module.exports = router;