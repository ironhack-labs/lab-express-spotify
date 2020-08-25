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
app.get('/', (req, res) => res.render('index'));

app.get('/artist-search', (req, res) => {
  const query = req.query.artist;

  spotifyApi
  .searchArtists(query)
  .then(data => {
    res.render('artist-search-results', data.body)
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res) => {
  const { id } = req.params;

  spotifyApi
  .getArtistAlbums(id)
  .then(data => {
    res.render('albums', data.body)
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/album/:id', (req, res) => {
  const { id } = req.params;

  spotifyApi
  .getAlbumTracks(id, { limit : 5 })
  .then(data => {
    console.log(data.body);
    res.render('album', data.body)
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
