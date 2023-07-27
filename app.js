require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('home');
});

app.use(express.urlencoded({ extended: true }));
app.get('/artist-search', (req, res) => {
    const artistName = req.query.artistName;
    spotifyApi
    .searchArtists(artistName)
    .then(data => {
      const artists = data.body.artists.items;
      res.render('artist-search-results.hbs', { artists });
    })
    .catch(err => console.log('The error while searching artists: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
  const artistId = req.params.artistId;

  spotifyApi
      .getArtistAlbums(artistId)
      .then(data => {
          const albums = data.body.items;
          res.render('albums', { albums });
      })
      .catch(err => console.log('Error searching artist albums: ', err));
});     

app.get('/tracks/:albumId', (req, res, next) => {
  const albumId = req.params.albumId;

  spotifyApi
      .getAlbumTracks(albumId)
      .then(data => {
          const tracks = data.body.items;
          res.render('tracks', { tracks });
      })
      .catch(err => console.log('Error fetching album tracks: ', err));
});

app.get('/albums', (req, res) => {
  res.render('albums');
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong', error));

const port = 3000;
app.listen(port, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
