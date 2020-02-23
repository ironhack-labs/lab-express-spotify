/* eslint-disable no-console */
require('dotenv').config();

const express = require('express');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));
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
app.get('/', (req, res) => res.render('index'));

app.get('/artist-search', (req, res) => {
  const { artistSearch } = req.query;
  spotifyApi
    .searchArtists(artistSearch)
    .then((data) => {
      const params = {
        items: data.body.artists.items,
      };
      res.render('artist-search-results', params);
    })
    .catch((err) => console.log('The error while searching for artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res) => {
  const { artistId } = req.params;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const params = {
        items: data.body.items,
      };
      res.render('albums', params);
    })
    .catch((err) => console.log('The error while searching for albums occurred: ', err));
});

app.get('/tracks/:albumId', (req, res) => {
  const { albumId } = req.params;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const params = {
        items: data.body.items,
      };
      console.log(`Track listing results are ${JSON.stringify(data)}`);
      res.render('tracks', params);
    })
    .catch((err) => console.log('The error while searching for tracks occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
