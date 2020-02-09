require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// ROUTES
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    const artistsArr = data.body.artists.items;
    res.render("artist-search-results", {artistsArr});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
  const artistId = req.params.artistId;
  spotifyApi
  .getArtistAlbums(artistId)
  .then(data => {
      const albums = data.body.items;
      res.render("albums", {albums});
  })
  .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get('/album-tracks/:albumId', (req, res, next) => {
  const albumId = req.params.albumId;
  spotifyApi
  .getAlbumTracks(albumId)
  .then(data => {
      const tracks = data.body.items;
      res.render("album-tracks", {tracks});
  })
  .catch(err => console.log('The error while searching tracks occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
