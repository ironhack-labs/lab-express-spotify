const express = require('express');
const router  = express.Router();
const SpotifyWebApi= require('spotify-web-api-node');

//Require environtment package
require('dotenv').config();
// Remember to paste your credentials here
// const clientId = 'b2d118cb235041a49e8a83c8f5b955f2',
//     clientSecret = 'a9a094e2297641ab9ae85cc332c2f61d';
const clientId = process.env.clientId,
    clientSecret = process.env.clientSecret;

const spotifyApi = new SpotifyWebApi({
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

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



router.get('/artist', (req, res,next)=>{
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      // console.log('Search artist by: ', data.body.artists.items)
      res.render('artists', {artists : data.body.artists.items})

    })
    .catch(err => {
      res.send("CRASH!!!!" + err);
    })
})


//Route by ID
router.get('/albums/:artistId', (req, res, next) => {
  // let albumId = req.params.id;
  spotifyApi.getArtistAlbums(req.params.artistId, { limit: 10 })
    .then(function(data) {
      // console.log('==========', data.body.items);
      res.render('album-detail', {albums : data.body.items} )
    });
});


router.get('/tracks/:albumId', (req, res, next) =>{
  // Get tracks in an album
  spotifyApi.getAlbumTracks(req.params.albumId, { limit : 5, offset : 1 })
  .then(function(data) {
    console.log(data.body.items);
    res.render('tracks', {tracks: data.body.items})
  }, function(err) {
    console.log('Something went wrong!', err);
  });

})

module.exports = router;
