require('dotenv').config()

const express = require('express')
const hbs = require('hbs')
const path = require('path')

// register partials
hbs.registerPartials(path.join(__dirname, '/views/partials/'))

const placeholder_url = '/images/placeholder_spotify.png'

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
})

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  )

const app = express()

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:

// Our routes go here:
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.q)
    .then((data) => {
      console.log('The received data from the API: ', data.body)
      const artists = data.body.artists.items.map((artist) => {
        return {
          name: artist.name,
          image: artist.images.length ? artist.images[0].url : placeholder_url,
          id: artist.id,
        }
      })
      res.render('artist-search-results', {
        artists: artists,
      })
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    )
})
// albums
app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      console.log('The received data from the API: ', data.body)
      const albums = data.body.items.map((album) => {
        return {
          name: album.name,
          image: album.images.length && album.images[0].url,
          id: album.id,
        }
      })
      res.render('albums', {
        albums: albums,
      })
    })
    .catch((err) =>
      console.log('The error while searching albums occurred: ', err)
    )
})

// tracks
app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      console.log('The received data from the API: ', data.body)
      const tracks = data.body.items
        .filter((track) => {
          return track.available_markets.includes('DE')
        })
        .map((track) => {
          return {
            title: track.name,
            preview_url: track.preview_url,
          }
        })
      res.render('tracks', {
        tracks: tracks,
      })
    })
    .catch((err) =>
      console.log('The error while searching tracks occurred: ', err)
    )
})

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
)
