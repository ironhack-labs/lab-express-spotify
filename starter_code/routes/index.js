
const router = require('express').Router()
require('dotenv').config()
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node')

router.use(bodyParser.urlencoded({extended:true}))

const spotifyApi = new SpotifyWebApi({
  clientId : process.env.ID,
  clientSecret : process.env.SECRET
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

router.get('/', (req, res) => {
  res.render('home')
})

router.get('/artists', (req, res) => {
  const {artists} = req.query
  console.log(artists)
  spotifyApi.searchArtists(artists)
    .then(data => {
      const {items} = data.body.artists
      console.log(items)
      items.forEach(el => console.log(el))
      res.render('artists', {
        items: items
      })
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
 })

 router.get('/albums/:artistId', (req, res) => {
  const {artistId} = req.params
  console.log(req.params)
  console.log(artistId)
  spotifyApi.getArtistAlbums(artistId)
    .then(data => {
      const {items} = data.body
      res.render('albums', {
        items: items
      })
    })
    .catch(err => {
      console.log("The error while searching albums occurred: ", err);
    })
 })

 router.get('/rolas/:id', (req, res) => {
  const {album} = req.params
  console.log(req.params)
  console.log(album)
  spotifyApi.getAlbumTracks(album)
    .then(data => {
      const {items} = data.body
      res.render('rolas', {
        items: items
      })
    })
    .catch(err => {
      console.log("The error while searching rolas occurred: ", err);
    })
 })

module.exports = router

