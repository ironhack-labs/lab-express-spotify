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

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/artist-search', (req, res) => {
    // console.log(req.query)
  spotifyApi
    .searchArtists(req.query.artistName)
    .then((data) => {
      const artists = data.body.artists.items
      // console.log("The received data from the API: ", artists);
    res.render('artist-search-results', {artists})
})
.catch((err) => console.log("The error while searching artists occurred: ", err));
})

app.get('/albums/:artistId', (req, res) => {
  // console.log('req.params', req.params)
  spotifyApi
   .getArtistAlbums(req.params.artistId)
   .then((foundUser) => {
    const albums = foundUser.body.items
  res.render('albums', {albums})
})
   .catch(err => console.log(err))
})

app.get('/track-information/:albumId', (req, res) => {
  console.log('req.params', req.params)
  spotifyApi
  .getAlbumTracks(req.params.albumId)
   .then((foundAlbum) => {
    const tracks = foundAlbum.body.items
  res.render('track-information', {tracks})
})
   .catch(err => console.log(err))
})