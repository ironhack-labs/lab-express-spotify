require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
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
app.get("/", (req, res) => {
  res.render("index");
});

// Search results route
app.get("/artist-search", (req, res) => {
  const { searchTerm } = req.query;
  spotifyApi
    .searchArtists(searchTerm)
    .then(data => {
      const artists = data.body.artists.items
      res.render("artist-search-results", { artists });
    })
    .catch(err => console.log("Error ocurred searching for artists:", err));
});

// Artist albums route
app.get("/albums/:artistID", (req, res, next) => {
  const { artistID } = req.params;
  spotifyApi
    .getArtistAlbums(artistID)
    .then(data => {
      const albums = data.body.items
      res.render("albums", { albums })
    })
    .catch(err => console.log("Error ocurred getting album:", err));
});

// Album tracks route
app.get("/tracks/:albumID", (req, res, next) => {
  const { albumID } = req.params;
  spotifyApi
    .getAlbumTracks(albumID)
    .then(data => {
      const tracks = data.body.items
      res.render("tracks", { tracks })
    })
    .catch(err => console.log("Error ocurred getting tracks:", err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
