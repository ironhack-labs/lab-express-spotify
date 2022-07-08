require('dotenv').config()

const express = require('express')
const hbs = require('hbs')

const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.set('view engine', 'hbs')
app.set('views', __dirname + '/pages')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
})

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    console.log('setting token', data.body['access_token'])
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch((error) => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:

app.get('/', (req, res) => {
  spotifyApi.searchArtists('Imagine Dragons').then((data) => console.log(data.body))
  res.render('home')
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
