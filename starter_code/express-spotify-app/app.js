const SpotifyWebApi = require('spotify-web-api-node')
const express = require('express')
const layouts = require('express-ejs-layouts')

const app = express()

app.set('views', __dirname + '/views/layouts')
app.set('view engine', 'ejs')

app.use(express.static('public'))

app.set(layouts)
app.set('layout', 'index')

// Remember to paste here your credentials
var clientId = '1c30624cba6742dcb792991caecae571',
    clientSecret = '746977b1e77240faa9d0d2411c3e0efe'

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
})

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
})

app.get('/', (req, res) => {
  res.render('search-form', {})
})

app.get('/artists', (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
  .then(function(data) {
    console.log(data.body.artists.items[0])
    res.render('artist-info', {
      artist: data.body.artists.items[0]
    })
  }, function(err) {
    console.error(err);
  })
})

let port = 3000
app.listen(port, () => {console.log(`Port ${port}`);})
