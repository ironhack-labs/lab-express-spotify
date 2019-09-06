const express = require('express')
const hbs = require('hbs')
const SpotifyWebApi = require('spotify-web-api-node')
require('dotenv').config()
const app = express()
// require spotify-web-api-node package here:

hbs.registerPartials(`${__dirname}/views/partials`)

const clientId = '9849dc22a72a4edcb06741ba567444bb',
  clientSecret = '202f94682316471e9337d74f1d635963'

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
})

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error)
  })

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/artist', (req, res) => {
  //el parametro de deconstruccion tiene que ser el mismo que el name del input del index.hbs
  const { artist } = req.query
  console.log(artist)
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists)
      res.render('artists', data.body.artists)
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err)
    })
})

app.get('/album/:id', (req, res) => {
  const artist = req.params.id
  spotifyApi
    .getArtistAlbums(artist)
    .then(data => {
      console.log('The received data from the API: ', data.body)
      res.render('album', { items: data.body.items })
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err)
    })
})

// setting the spotify-api goes here:

// the routes go here:

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`My Spotify project running on port ${PORT} 🎧 🥁 🎸 🔊`)
})
