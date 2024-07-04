require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Spotify API setup
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Artist search route
app.get('/artist-search', (req, res) => {
  const { artist } = req.query;

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      console.log('The received data from the API: ', data.body);
      res.render('artist-search-results', { artists: data.body.artists.items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

// Albums route
app.get('/albums/:artistId', (req, res) => {
  const { artistId } = req.params;

  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      console.log('Artist albums', data.body);
      spotifyApi.getArtist(artistId).then(artistData => {
        res.render('albums', { albums: data.body.items, artistName: artistData.body.name });
      });
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
});

// Tracks route
app.get('/tracks/:albumId', (req, res) => {
  const { albumId } = req.params;

  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      console.log('Album tracks', data.body);
      spotifyApi.getAlbum(albumId).then(albumData => {
        res.render('tracks', { tracks: data.body.items, albumName: albumData.body.name });
      });
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
