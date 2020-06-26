require('dotenv').config()

const express = require('express')
const path = require('path')
const hbs = require('hbs')

// require spotify-web-api-node package here:
var SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.set('view engine', 'hbs')
//app.set('views', __dirname + '/views')
hbs.registerPartials(path.join(__dirname, '/views/partials/'))
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
})

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  )

// Our routes go here:
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log(req.query.artist)
      console.log('The received data from the API: ', data.body.artists.items)
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

      res.render('artist-search', {
        artist: data.body.artists.items,
        search: req.query.artist
      })
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    )
})

app.get('/albums/:id', (req, res) => {
  const id = req.params.id
  spotifyApi.getArtistAlbums(id).then(
    (data) => {
      console.log('Artist albums', data.body.items[0].images)
      res.render('albums', {
        album: data.body.items
      })
    },
    (err) => {
      console.error(err)
    }
  )
})

app.get('/tracks/:id', (req, res) => {
  const id = req.params.id
  const cover = req.query.cover
  const album = req.query.album
  spotifyApi.getAlbumTracks(id).then(
    (data) => {
      console.log(JSON.stringify(data.body.items))
      res.render('tracks', {
        tracks: data.body.items,
        cover: cover,
        artist: data.body.items[0].artists[0].name,
        album: album
      })
    },
    (err) => {
      console.log('Something went wrong!', err)
    }
  )
})

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
)
