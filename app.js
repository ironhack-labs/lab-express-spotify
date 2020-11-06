require('dotenv').config();

const express = require('express')
const hbs = require('hbs')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const SpotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
})

SpotifyApi
  .clientCredentialsGrant()
  .then(data => SpotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', async (req, res) => res.render('index'))

app.get('/artist-search', async (req, res) => {
  const {Artist} = req.query
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    SpotifyApi
    .searchArtists(Artist)
    .then(data => {
      const artists = data.body.artists.items
      console.log(artists[0].images[0].url)
      res.render('artist-search-results', {artists})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', async (req, res) => {
  const {id} = req.params
  SpotifyApi.getArtistAlbums(id)
  .then(function(data) {
    const albums = data.body.items
    console.log('Artist albums', albums);
    res.render('albums', {albums})
  }, function(err) {
    console.error(err);
  });
})

app.get('/tracks/:id', async (req, res) => {
  const {id} = req.params
  SpotifyApi.getAlbumTracks(id)
  .then(function(data) {
    const tracks = data.body.items
    console.log(tracks);
    res.render('tracks', {tracks})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
