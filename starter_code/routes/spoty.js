const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
// Setters
var clientId = 'b2ca520ca1d24999b30a36327203d1ca',
    clientSecret = '13853f1c7dbb4a90a22f360aace56c5b';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Error ', err);
});

router.get('/', (req, res) => {
  res.render('index.hbs');
});

router.get('/artists', (req, res) =>{
  const artist = req.param('artist')

  spotifyApi.searchArtists(artist)
  .then((data) => {      
      const artists = data.body.artists.items;
      console.log(artists);
      res.render('artists', {artists, artist});
  })
  .catch((err) => {
      console.log(err);
  })
});

router.get('/albums/:id', (req, res) => {
  const id = req.params.id;
  
  spotifyApi.getArtistAlbums(id)
  .then((data) => {
    const albums = data.body.items;
    res.render('albums', {albums});
  })
  .catch((err) => {
    console.error(err);
  })
});

router.get('/tracks/:id', (req, res) => {
  const id = req.params.id;

  spotifyApi.getAlbumTracks(id)
  .then(function(data) {
    const tracks = data.body.items;
    console.log(tracks)
    res.render('tracks', {tracks});
  }, function(err) {
    console.log('Error ', err);
  });

});

module.exports = router;