require('dotenv').config();
const path = require('path');
const express = require('express');
// const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/artists', (req, res) => {
  const {artists} = req.query;
  spotifyApi
    .searchArtists(artists)
    .then(data => {
      // console.log(data.body.artists);
      const {items} = data.body.artists;
      res.render('artists', {items});
    })
    .catch(err => {
      throw new Error(err);
    });
});

app.get('/albums/:artistId', (req, res) => {
  const {artistId} = req.params;
  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      // console.log(data.body); estrutura
      const {items} = data.body; //desconstrucao
      res.render('albuns', {items}); //objeto
    })
    .catch(err => {
      throw new Error(err);
    });
});

app.get('/tracks/:trackId', (req, res) => {
  const {trackId} = req.params;
  spotifyApi
    .getAlbumTracks(trackId)
    .then(data => {
      // console.log(data.body); estrutura
      const {items} = data.body; //desconstrucao
      res.render('tracks', {items}); //objeto
    })
    .catch(err => {
      throw new Error(err);
    });
});

app.listen(5000, () =>
  console.log('My Spotify project running on port 4000 🎧 🥁 🎸 🔊')
);
