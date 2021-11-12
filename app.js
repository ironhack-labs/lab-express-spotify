require('dotenv').config()

const express = require('express')
const hbs = require('hbs')
const path = require('path')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

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

// Partials
hbs.registerPartials(path.join(__dirname, 'views/partials'))

// Our routes go here:

// Artist Search
app.get('/', (req, res, next) => {
  res.render('index', { docName: 'Home Page' })
  console.log('Its working')
})

// Artists and Albums displayed
app.get('/artist-search', (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.q.toLowerCase())
    .then((data) => {
      // console.log('The received data from the API: ', data.body.artists.items)
      res.render('artist-search-results', {
        result: data.body.artists.items,
        docName: 'Artist Page',
      })
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    )
})

// View Album
app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      res.render('albums', { result: data.body.items, docName: 'Album Page' })
    })
    .catch((err) => console.log(err))
})

// View Track
app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      res.render('tracks', { result: data.body.items, docName: 'Tracks Page' })
    })
    .catch((err) => console.log(err))
})

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
)

//  {
//     external_urls: {
//       spotify: 'https://open.spotify.com/artist/3WrFJ7ztbogyGnTHbHJFl2'
//     },
//     followers: { href: null, total: 21012251 },
//     genres: [
//       'beatlesque',
//       'british invasion',
//       'classic rock',
//       'merseybeat',
//       'psychedelic rock',
//       'rock'
//     ],
//     href: 'https://api.spotify.com/v1/artists/3WrFJ7ztbogyGnTHbHJFl2',
//     id: '3WrFJ7ztbogyGnTHbHJFl2',
//     images: [ [Object], [Object], [Object] ],
//     name: 'The Beatles',
//     popularity: 88,
//     type: 'artist',
//     uri: 'spotify:artist:3WrFJ7ztbogyGnTHbHJFl2'
//   }
