require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials");


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
//home
app.get('/', (req, res, next) => {
  res.render('home')
});

// Handle the artist search form submission
app.get('/artist-search', (req, res) => {
  const { artist } = req.query;

  spotifyApi.searchArtists(artist)
    .then((data) => {
      const artists = data.body.artists.items;
      res.render('artist-search-results', { artists });
    })
    .catch((error) => {
      console.error('Error searching for artist:', error);
      res.render('error');
    });
});

app.get('/albums/:artistId', (req, res) => {
  const { artistId } = req.params

  spotifyApi.getArtistAlbums(artistId).then(data => {
    const albums = data.body.items

    res.render('albums', { albums });
  })
  .catch((error) => {
      console.error('Error searching for artist album:', error);
      res.render('error');
    });
});

// Handle the album tracks endpoint
app.get('/tracks/:albumId', (req, res) => {
  const { albumId } = req.params;

  spotifyApi.getAlbumTracks(albumId)
    .then((data) => {
      const tracks = data.body.items;
      res.render('tracks', { tracks });
    })
    .catch((error) => {
      console.error('Error getting album tracks:', error);
      res.render('error', { title: 'Error' });
    });
});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
