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
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

// localhost:3000/
app.get('/', (req, res) => {
  res.render('index');
});

// localhost:3000/artist-search?artist=value
app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      // console.log('The received data from the API: ', data.body.artists.items[0]);
      const artistsData = {
        artistSearch: req.query.artist,
        artistsList: data.body.artists.items
      }
      res.render('artist-search-results', artistsData);
    })
    .catch((err) => console.log('The error while searching artists occurred: ', err));
});

// localhost:3000/albums/artist
app.get('/albums/:artistId', (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      // console.log('Albums:', data.body);
      const artist = {
        artistName: data.body.items[0].artists[0],
        artistAlbums: data.body.items
      }
      res.render('albums', artist);
    })
    .catch((err) => console.log('The error while searching albums occurred: ', err))
});

// localhost:3000/tracks/:albumId
app.get('/tracks/:albumId', (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      // console.log('Tracks: ', data.body.items);
      const tracks = {
        albumTracks: data.body.items
      }
      res.render('tracks', tracks);
    })
    .catch((err) => console.log('The error while searching tracks occurred: ', err))
});

app.get('*', (req, res) => {
  res.send('<h1>404, Page not Found</h1>');
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
