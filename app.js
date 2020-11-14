require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({ extended: true }));
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

app.get('/', (req, res) => {
  res.render('index'); 
})

app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artistName)
    .then(data => {
      // console.log('Artists data: ', data.body.artists.items);
      const artists = data.body.artists.items; 
      res.render("artist-search-results", { artists });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
  const { artistId } = req.params; 

  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      // console.log('Albums data: ', data.body.items);
      const albums = data.body.items; 
      res.render("albums", { albums });
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get('/tracks/:albumId', (req, res, next) => {
  const { albumId } = req.params; 

  spotifyApi
    .getAlbumTracks(albumId, { limit : 8, offset : 1 })
    .then(data => {
      // console.log('Tracks data: ', data.body.items);
      const tracks = data.body.items;
      res.render("tracks", { tracks });
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
