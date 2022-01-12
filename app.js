require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// Our routes go here:
app.get('/', (req, res) => {
    res.render('home')
  })

  app.get('/artist-search', async (req, res) => {
    const artistSearched = req.query.artist
    try {
      const artistInfo = await spotifyApi.searchArtists(artistSearched)
      res.render('artist-search-results', { artist: artistInfo.body.artists.items })
    } catch (err) {
      console.log('The error while searching artists occurred: ', err)
    }
  })
  
  app.get('/albums/:Id', async (req, res) => {
    const albumSearched = req.params.Id
    try {
      const artistAlbum = await spotifyApi.getArtistAlbums(albumSearched) 
      res.render('albums', { album: artistAlbum.body.items})
    } catch {
      console.log('The error while searching album occurred: ', err)
    }
  })
  
  app.get('/tracks/:Id', async (req, res) => {
    const tracksSearched = req.params.Id
    try {
      const artistTracks = await spotifyApi.getAlbumTracks(tracksSearched)
      console.log(artistTracks.body.items)
      res.render('tracks', { track: artistTracks.body.items })
    } catch {
      console.log('The error while searching tracks occurred: ', err)
    }
  })

app.listen(3000, () => 
console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
