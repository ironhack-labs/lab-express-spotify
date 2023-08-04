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

app.get('/', (req,res) => {
  res.render('index');
  
});

app.get('/artist-search', async (req, res) => {
  try {
    const {artist} = req.query;
    let allArtists = await spotifyApi.searchArtists(artist);
    console.log(allArtists.body.artists.items)
    res.render('artist-search-results', {artists: allArtists.body.artists.items})
  }
  catch (error) {
    console.log(error)
  }
})

app.get('/albums/:artistId', async (req,res, next) => {
  try {
    const {artistId} = req.params;
    let searchedAlbums = await spotifyApi.getArtistAlbums(artistId)
    console.log(searchedAlbums.body.items);
    res.render('albums', {searchedAlbums: searchedAlbums.body.items})
    
  }

  catch (error) {
    console.log(error);
  }
  
})

app.get('/tracks/:artistId', async (req,res, next) => {
  try {
    const {artistId} = req.params;
    let searchedTracks = await spotifyApi.getAlbumTracks(artistId)
    console.log(searchedTracks.body.items);
    res.render('tracks', {searchedTracks: searchedTracks.body.items})
    
  }

  catch (error) {
    console.log(error);
  }
  
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
