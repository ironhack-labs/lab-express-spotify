const express = require('express')
const router = express.Router()

const SpotifyWebApi = require('spotify-web-api-node')
// Retrieve an access token
const clientId = process.env.CLIENTID
const clientSecret = process.env.CLIENTSECRET

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

router.get('/:id', (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(albums => {
      console.log('The received data from the API: ', albums.body.items)
      res.render('albums', { albums: albums.body.items })
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err)
    })
})

module.exports = router

//app.get('/show-flights-results', (req, res) => {
//  res.send(req.query)
//  console.log(`Viaje desde ${req.query.city}, del  ${req.query.from} al ${req.query.to}`)
//})
