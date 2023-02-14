require('dotenv').config()

const express = require('express')
const hbs = require('hbs')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()
const PORT = process.env.PORT || 5050

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
})
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  )

// Our routes go here:
app.get('/', (req, res, next) => {
  try {
    res.render('index')
  } catch (error) {
    console.log('Error occurred while looking up tracks')
  }
})

//Iteration 3 | Search for an Artist
app.get('/artists/search', async (req, res, next) => {
  try {
    //console.log(req.query)
    const listArtists = await spotifyApi.searchArtists(req.query.artist)
    //console.log(listArtists)
    res.render('artist-search-results', {
      allArtists: listArtists.body.artists.items,
    })
  } catch (error) {
    console.log('Error occurred while looking up tracks')
  }
})

//Iteration 4 | View Albums
app.get('/albums/:artistId', async (req, res, next) => {
  try {
    const listAlbums = await spotifyApi.getArtistAlbums(req.params.artistId)
    res.render('albums', {
      allAlbums: listAlbums.body.items,
    })
  } catch (error) {
    console.log('Error occurred while looking up tracks')
  }
})

app.get('/tracks/:trackId', async (req, res, next) => {
  try {
    const listTracks = await spotifyApi.getAlbumTracks(req.params.trackId)
    res.render('tracks', {
      allTracks: listTracks.body.items,
    })
  } catch (error) {
    console.log('Error occurred while looking up tracks')
  }
})

app.listen(PORT, () =>
  console.log(`My Spotify project running on port ${PORT} 🎧 🥁 🎸 🔊`)
)
