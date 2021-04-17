require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const app = express();
const port = 3000;

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


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
  .catch(err => console.log('An error while searching artists occurred:', err));

// Our routes go here:
app.get("/", (req, res) => {
  res.status(200).render("home");
});

app.get("/artist-search", (req, res) => {

  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      res.status(200).render('artist-search-results', { artists: data.body.artists.items })
    })
    .catch(err => console.log('An error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res) => {
  const { artistId } = req.params;

  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      const albums = data.body.items
      res.status(200).render('albums', { albums })
    })
    .catch(err => console.log('An error while searching albums occurred: ', err));
})

app.get('/tracks/:trackId', (req, res) => {
  const { trackId } = req.params;

  spotifyApi
    .getAlbumTracks(trackId)
    .then(data => {
      const track = data.body.items
      res.render('tracks', { track })
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));
})

app.listen(port, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


