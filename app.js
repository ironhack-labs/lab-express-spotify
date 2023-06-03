// @ts-nocheck
require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node') // require spotify-web-api-node package

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
})

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retreiving an access token: ' + error))

// Our routes go here:
app.get('/', (req, res) => {
  res.render('home')
})

app.get('/artist-search', (req, res) => { 
  const { artist } = req.query
  spotifyApi
    .searchArtists(artist)
    .then(artistData => {
      const artists = artistData.body.artists.items
      // res.send(JSON.stringify(artists))
      res.render('artist-search-results', { artists })
    })
    .catch(error => console.log('Artist search error: ' + error))
})

app.get('/albums/:artistId', (req, res) => {
  const artistId = req.params.artistId
  spotifyApi
    .getArtistAlbums(artistId)
    .then(albumsData => {
      const albums = albumsData.body.items
      // res.send(JSON.stringify(albums))
      res.render("albums", { albums })
    })
  .catch(error => console.log('Album serach error: ' + error))
}) 

app.get('/tracks/:albumId', (req, res) => { 
  const albumId = req.params.albumId
  spotifyApi
    .getAlbumTracks(albumId)
    .then(tracksData => {
      const tracks = tracksData.body.items
      res.send(JSON.stringify( {tracks} ))
      // res.render("tracks", { tracks })
    })
    .catch(error => console.log('Track display error: ' + error))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
