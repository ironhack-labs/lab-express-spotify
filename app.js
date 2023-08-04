require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req,res) =>{
   res.render('index');
})

app.get('/artist-search', async (req,res) =>{
  try {
    const {artistName} = req.query
    let searchedArtist = await spotifyApi.searchArtists(artistName)
    const artist = searchedArtist.body.artists.items
    console.log(artist)

    res.render('artist-search', {artist})
  } catch (error) {
    console.log('An error:', error);
  }
})

app.get('/albums/:artistId', async (req, res, next) =>{
  try {
    const { artistId } = req.params
    let artistAlblum = await spotifyApi.getArtistAlbums(artistId)
    const album = artistAlblum.body.items
    console.log(album)
    
    res.render('albums', {album});
  } catch (error) {
    console.log('An error:', error)
  }
})

app.get('/tracks/:albumId', async (req, res) => {
  try {
    const { albumId } = req.params
    let alblumTrack = await spotifyApi.getAlbumTracks(albumId)
    const track = alblumTrack.body.items
    console.log(track)

    res.render('tracks', {track});
  } catch (error) {
    console.log('An error:', error)
  }
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
