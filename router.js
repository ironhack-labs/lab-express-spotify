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
  .then(data => {
    res.render('artists', {
      title: 'Artist',
      searchParam: req.query.artist,
      artistList: data.body.artists.items
    })
  }, err => {
    console.error(err);
  });
})

router.get('/artist/:id', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.id, { limit: 50 })
  .then(data => {
    const albums = data.body.items.filter(item => item.album_type === 'album')
    const singles = data.body.items.filter(item => item.album_type === 'single')
    const others = data.body.items.filter(item => item.album_type !== 'single' && item.album_type !== 'album')
    
    res.render('artist', {
      title: 'Albums and Singles',
      albums: albums,
      singles: singles,
      others: others
    })
  }, err => {
    console.error(err);
  });
})

router.get('/player/:id', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.id, { limit: 50 })
  .then(function(data) {
    res.render('player', {
      title: 'Tracks',
      tracks: data.body.items
    })
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

module.exports = router