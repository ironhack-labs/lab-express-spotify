require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/spotify',
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch((error) => {
    console.log('Something went wrong when retrieving an access token', error);
  });

app.get('/', (req, res) => {
  res.render('homepage');
});

app.get('/artist-search', (req, res) => {
  const artistName = req.query.artist;

  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      console.log('The received data from the API: ', data.body);
      const artists = data.body.artists.items;
      res.render('artist-search-results', { artists });
    })
    .catch((err) => console.log('The error while searching artists occurred: ', err));
});
app.get('/albums/:artistId', (req, res, next) => {
  const artistId = req.params.artistId;

  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      console.log('Artist albums:', data.body);
      const albums = data.body.items;
      res.render('albums', { albums });
    })
    .catch((err) => {
      console.log('The error occurred while retrieving the albums:', err);
      next(err);
    });
});
app.get('/tracks/:albumId', (req, res, next) => {
  const albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      console.log('The received data from the API: ', data.body);
      const tracks = data.body.items;
      res.render('tracks', { tracks });
    })
    .catch((err) => console.log('The error while searching tracks occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
