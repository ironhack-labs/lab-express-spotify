require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

// Retrieve an access token
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// setting the spotify-api goes here:
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Our routes go here:
app.get('/', (req, res) => { res.render('index')});

app.get('/artist-search', (req, res) => {
  console.log("artist: ", req.query.artist)
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    const dataset = data.body.artists.items
    res.render('artist-search-results', {dataset})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:id', (req, res) => {
  const id = req.params.id
  spotifyApi
  .getArtistAlbums(id)

  .then(data => {
    console.log(data.body.items)
    const albums = data.body.items
    res.render('albums', {albums})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
