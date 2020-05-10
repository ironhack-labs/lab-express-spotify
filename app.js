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
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist-search', (req, res) => {
  const term = req.query.artists_name;
  spotifyApi
    .searchArtists(term)
    .then((data) => {
      console.log('The received data from the API: ', data.body.artists.items);
      const artists = data.body.artists.items;
      res.render('artist-search-results', { artists });
    })
    .catch((err) => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId?', (req, res, next) => {
  const term = req.params.artistId;
  spotifyApi.getArtistAlbums(term, { limit: 10, offset: 20 }, function (err, data) {
    if (err) {
      console.error('Something went wrong!');
    } else {
      const albums = data.body.items;
      res.render('albums', { albums });
      console.log(data.body.items);
    }
  });
});

app.get('/tracks/:albumId?', (req, res, next) => {
  const term = req.params.albumId;
  console.log(term);
  spotifyApi.getAlbumTracks(term, { limit: 5, offset: 1 }).then(
    function (data) {
      const tracks = data.body.items;
      res.render('tracks', { tracks });
      console.log(data.body.items);
    },
    function (err) {
      console.log('Something went wrong!', err);
    }
  );
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
