require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
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
app.get('/', (req, res) => {
  res.render('home')
})

app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.q)
    .then(data => {
      console.log(data.body.artists.items)
      res.render('artist-search-results', {
        artists: data.body.artists.items
      })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      console.log(data.body.items[0])
      res.render('albums', {
        albums: data.body.items,
        name: data.body.items[0].artists[0].name
      })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId/:albumTitle/tracks', (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.artistId)
    .then(data => {
      res.render('tracks', {
        songs: data.body.items,
        albumTitle: req.params.albumTitle
      })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));