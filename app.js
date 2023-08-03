require('dotenv').config()

const express = require('express')
const hbs = require('hbs')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
})

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:
app.get('/', (req, res) => {
  res.render('home-page')
})

app.get('/artist-search', (req, res) => {
  const { artistName } = req.query

  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      res.render('artist-search-results', { artists: data.body.artists.items })
    })
    .catch((err) => console.log('The error while searching artists occurred: ', err))
})

app.get('/albums/:artistId', (req, res, next) => {
  const { artistId } = req.params
  spotifyApi.getArtistAlbums(artistId).then((data) => {
    res.render('albums-page', { albums: data.body.items })
  })
})

app.get('/albums/tracks/:id', (req, res, next) => {
  const { id } = req.params
  spotifyApi.getAlbumTracks(id).then((data) => {
    res.render('tracks-page', { tracks: data.body.items })
  })
})

app.listen(5005, () => console.log('My Spotify project running on port 5005 🎧 🥁 🎸 🔊'))
