require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

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

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/artist-search', (req, res) => {
  spotifyApi.searchArtists(req.query.artist) // req.query.artist is whatever i wrote in the input field
    .then(data => {
      // console.log('The received data from the API: ', data.body.artists.items[0]);
      res.render('artist-search-results', {
        artist: data.body.artists.items
      })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res) => {
  const id = req.params.id;
  // console.log('asa')
  spotifyApi.getArtistAlbums(id).then(data => {
      // console.log(data.body.items[0])
      res.render('albums', {
        album: data.body.items
      })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/tracks/:id', (req, res) => {
  const id = req.params.id;
  // console.log('aalalalalalaalla')
  spotifyApi.getAlbumTracks(id).then(data => {
      console.log(data.body.items)
      res.render('tracks', {
        track: data.body.items
      })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));