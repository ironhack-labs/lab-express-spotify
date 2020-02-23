require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.use(express.static(path.join(__dirname, '/public')));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body.access_token))
  .catch((error) => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
  res.render('artist-search');
});

app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.searchArtist)
    .then((data) => {
      console.log('The received data from the API: ', data.body);
      res.render('artist-search-results', { data });
    })
    .catch((err) => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      console.log('The received data from the API: ', data.body);
      res.render('albums', { data });
    })
    .catch((err) => console.log('The error while searching albums occurred: ', err));
});

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      console.log('The received data from the API: ', data.body);
      res.render('tracks', { data });
    })
    .catch((err) => console.log('The error while searching tracks occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
