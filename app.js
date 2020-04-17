require('dotenv').config()
const SpotifyWebApi = require('spotify-web-api-node')
const express = require('express')
const hbs = require('hbs')

// require spotify-web-api-node package here:

const app = express()

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
})

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:
app.get('/', (req, res, next) => {
  res.render('index')
})

app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      // console.log('The received data from the API: ', data.body)
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const { items } = data.body.artists
      res.render('artist-search', { items })
    })
    .catch((err) => console.log('The error while searching artists occurred: ', err))
})

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      // console.log('Artist albums', data.body)
      const { items } = data.body
      res.render('albums', { items })
    })
    .catch((err) => console.log(err))
})

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      const { items } = data.body
      console.log(data.body)
      res.render('tracks', { items })
      // console.log(data.body.items)
    })
    .catch((err) => console.log(err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
