require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const spotifyAPI = new SpotifyWebApi();

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
// Define the index route that renders the home page
app.get('/', (req, res) => {
    res.render('index')
  });

  app.get('/artist-search', (req, res) => {
    const artistName = req.query.artistName;
    spotifyApi
      .searchArtists(artistName)
      .then(data => {
        const artists = data.body.artists.items;
        res.render('artist-search-results', { artists });
      })
      .catch(err => console.log('Error while searching artists', err));
  });
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
    spotifyApi.getArtistAlbums(artistId)
      .then(data => {
        console.log('Artist albums', data.body);
        const albums = data.body.items;
        res.render('albums', { albums });
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });