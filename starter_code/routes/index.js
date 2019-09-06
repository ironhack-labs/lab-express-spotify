const router = require('express').Router()
require('dotenv').config()
const SpotifyWebApi = require('spotify-web-api-node');

// setting the spotify-api goes here:
const clientId = process.env.clientId
const clientSecret = process.env.clientSecret

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/artists', (req, res) => {
  const artist = req.query.artist

  spotifyApi.searchArtists(artist)
    .then(data => {
      //console.log(data.body.artists.items)
      res.render('artists', {
        artists: data.body.artists.items
      })
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
      res.render('artists')
    })
})

router.get('/albums/:artistId', (req, res) => {
  const id = req.params.artistId

  spotifyApi.getArtistAlbums(id)
    .then(data => {
      res.render('albums', data.body)
      console.log(data.body)
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
      res.render('albums')
    })
})

router.get('/tracks/:id', (req, res) => {
  const id = req.params.id

  spotifyApi.getAlbumTracks(id)
    .then(data => {
      res.render('tracks', data.body)
      //console.log(data.body)
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
      res.render('tracks')
    })
})

module.exports = router