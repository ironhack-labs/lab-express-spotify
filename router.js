require('dotenv').config();

const express = require('express')
const router = express.Router()

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// setting the spotify-api goes here:
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body.access_token))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


// middleware that is specific to this router
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home'
  })
})

router.get('/artists', (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
  .then(function(data) {
    console.log(data.body.artists.items[6]);
    
    res.render('artists', {
      title: 'Artist',
      param: req.query.artist,
      artistList: data.body.artists.items
    })
  }, function(err) {
    console.error(err);
  });
})
router.get('/albums/:id', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.id, { limit: 10, offset: 20 })
  .then(function(data) {
    console.log(data.body);
    
    res.render('albums', {
      title: 'Artist',
    })
  }, function(err) {
    console.error(err);
  });
})

module.exports = router