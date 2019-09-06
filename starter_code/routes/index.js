const router = require('express').Router()
require('dotenv').config()

// Spotify Setup
const SpotifyWebApi = require('spotify-web-api-node')
const clientId = process.env.clientId
const clientSecret = process.env.clientSecret
const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
})
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error)
  })

/****************** HOME ****************/
router.get('/', (req, res) => {
  res.render('index')
})

/****************** ARTISTS ****************/
router.get('/artists', (req, res) => {
  // Consulta a la API
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      res.render('artists', data.body.artists)
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err)
    })
})

/****************** ALBUMS ****************/
router.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      res.render('albums', data.body)
    })
    .catch(err => {
      console.log('The error while searching albums occurred: ', err)
    })
})

/****************** TRACKS ****************/
router.get('/albums/:albumId/tracks', (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
      console.log(data.body)
      res.render('tracks', data.body)
    })
    .catch(err => {
      console.log('The error while searching albums occurred: ', err)
    })
})

module.exports = router
