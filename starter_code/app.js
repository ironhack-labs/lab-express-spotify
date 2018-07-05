const SpotifyWebApi = require('spotify-web-api-node')
const express       = require('express')
const hbs           = require('hbs')
const path          = require('path')
const debug         = require('debug')('ironSpotify:app')
const bodyParser    = require('body-parser')


// Spotify credentials
let clientId = '0e7192709e3a479fb436244d905c2a94',
    clientSecret = 'c134d3b963474955bf8b76ee62869036';

let spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
})

// Spotify access token
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token'])
  }, function(err) {
    debug('Something went wrong when retrieving an access token', err)
})

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
hbs.registerPartials(__dirname + '/views/partials')

app.get('/', (req, res, next) => {
  res.render('index', {title: 'Spotify'})
})


app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render('artists', {title: 'Artists', artists: data.body.artists.items})
    })
    .catch(err => {
      debug(`Error al buscar artistas: ${err}`)
    })
})



app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      res.render('albums', {title: 'Albums', albums: data.body.items})
    })
    .catch(err => {
      debug(`Error al buscar albumes: ${err}`)
    })
})


app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
      res.render('tracks', {title: 'Tracks', tracks: data.body.items})
    })
    .catch(err => {
      debug(`Error al buscar canciones: ${err}`)
    })
})



app.listen(3000)
