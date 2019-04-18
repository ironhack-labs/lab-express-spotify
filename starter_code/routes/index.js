const express = require('express')
const router = express.Router()

//////////////////
// setting the spotify-api goes here:
const SpotifyWebApi = require('spotify-web-api-node')

const clientId = 'ddfb82f654144feeb16633ba7403de12',
    clientSecret = 'ddc80df7a0174bb390f91a1b7c9a3479';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })
//////////////////

//routes
router.get('/', (req, res) => {
  res.render('index')
})

router.post('/artists', (req, res) => {
  const { artist } = req.body

  spotifyApi.searchArtists(artist)
    .then(data => {
      const artists = data.body.artists.items
      res.render('artists', {artists})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})

router.get('/albums/:id', (req, res) => {
  const { id } = req.params
  spotifyApi.getArtistAlbums(id)
    .then(data => {
      const albums = data.body.items
      res.render('albums', { albums })
      //res.send(data.body)
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    })
})

router.get('/tracks/:id', (req, res) => {
  const { id } = req.params
  spotifyApi.getAlbumTracks(id)
    .then(data => {
      const tracks = data.body.items
      res.render('tracks', { tracks })
      //res.send(data.body)
    })
    .catch(err => {
      console.log("The error while searching tracks occurred: ", err);
    })

})

module.exports = router