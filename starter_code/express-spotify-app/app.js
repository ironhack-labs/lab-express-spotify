// =============================
//      Node Modules and consts
// =============================
const SpotifyWebApi       = require('spotify-web-api-node')
const express             = require('express')
const expressLayouts      = require('express-ejs-layouts')
const bodyParser          = require('body-parser')
const morgan              = require('morgan')

// Spotify credentials and API
const clientId            = 'ee7ca397970a48b9b4ae5995681bd4fe'
const clientSecret        = '4d6a21c498174d908184823696173e21'

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
})

// Retrieving a Apotify access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token'])
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err)
  })


// ==================================
//      Setting up our express app
// ==================================
const app = express()

app.use(
  morgan(`Request Method: :method, Request URL: :url, Response Time: :response-time(ms)`))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static('public'))
app.use(expressLayouts)
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/main-layout')
app.set('view engine', 'ejs')


// ==================================
//      Routing our application
// ==================================
//      /
//      /artist           ?artistID=
//      /artist/albums    ?albumID=

// Home
app.get('/', (req, res, next) => {
  res.render('index')
})

// Artists search page
app.post('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.body.artist)
    .then(function (result) {
      res.render('artists', {
        queried_artist: req.body.artist,
        data: result.body.artists.items
      })
    }, function (err) {
      console.error(err)
    })
})

// Artist album page
app.get('/albums/', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.query.artistID)
    .then(function (result) {
      res.render('albums', {
        albums: result.body.items
      })
    }, function (err) {
      console.error(err)
    })
})

// Album tracks page
app.get('/albums/tracks', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.query.albumID)
    .then(function (result) {
      res.render('tracks', {
        tracks: result.body.items
      })
    }, function (err) {
      console.log('Something went wrong!', err)
    })
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})