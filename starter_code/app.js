// ------------------
// REQUIRE PACKAGES
// ------------------
const express = require('express')
const app = express()
const hbs = require('hbs')
const SpotifyWebApi = require('spotify-web-api-node')

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

const clientId = 'c230dab42b3f445c8e4284cda7a10907'
const clientSecret = '0d4d93f803e047b4bb6e7081fbfa6371'

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
})

// Retrieve access token
spotifyApi.clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error)
  })

// -----------
// ROUTES
// -----------

app.get('/', (req, res, next) => {
  res.render('index')
})

app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artistName)
    .then(data => {
      res.render('artists', { theArtist: data.body.artists.items })
    })
    .catch(err => {
      console.log('Error while searching artists: ', err)
    })
})

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      res.render('albums', {
        theAlbum: data.body.items, theArtistName: data.body.items[0].artists[0].name
      })
    })
    .catch(err => { console.log('Error while searching albums: ', err) })
})

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
      res.render('tracks', { theTracks: data.body.items })
    })
    .catch(err => console.log('Error while searching tracks: ', err))
})

// -----------
// CONNECT
// -----------
app.listen(3001, () => console.log('My Spotify project running on port 3001 🎧 🥁 🎸 🔊'))
