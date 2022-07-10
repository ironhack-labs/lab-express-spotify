require('dotenv').config()

const express = require('express')
const hbs = require('hbs')
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.set('views', `${__dirname}/pages`)
app.set('view engine', 'hbs')
app.use(express.static(`${__dirname}/public`))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
})

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch((error) => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:
app.get('/', (req, res) => {
  res.render('home')
})

app.get('/artist-search', (req, res) => {
  if (req.query.artists === '') return res.redirect('/')
  spotifyApi
    .searchArtists(req.query.artists)
    .then((data) => {
      const artistInfo = data.body.artists.items.map((artist) => {
        return { id: artist.id, name: artist.name, imageUrl: artist.images.length > 0 ? artist.images[1].url : '/images/no_image.png' }
      })
      res.render('artist-search', { artists: artistInfo })
    })
    .catch((err) => console.log('An error ocurred:', err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
