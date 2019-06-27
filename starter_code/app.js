require('dotenv').config()
const express = require('express')
const hbs = require('hbs')
// require spotify-web-api-node package here:
const spotify = require('spotify-web-api-node')
const clientId = process.env.CLIENTID
const clientSecret = process.env.CLIENTSECRET

// setting the spotify-api goes here:
const spotifyApi = new spotify({
  clientId,
  clientSecret
})

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(err => {
    console.log('You have an Error:', err)
  })

const app = express()

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))
hbs.registerPartials(__dirname + '/partials')

// the routes go here:

app.get('/', (req, res) => {
  res.render('index')
})
app.get('/artist', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log(data)
      res.render('artist', data.body.artists)
    })
    .catch(err => {
      console.log(err)
    })
})
app.get('/albums/:id', (req, res) => {
  spotifyApi
    .getArtistAlbums(req.query.albums)
    .then(data => {
      console.log(data.body.artist.items)
      res.render('albums')
    })
    .catch(err => {
      console.log(err)
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
