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
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:
app.get('/', (req, res) => {
  res.render('home-page');
});

app.get('/results', (req, res) => {
  const { artist } = req.query;

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      const items = data.body.artists.items;
      res.render('results', { items });

      const img = items[0].images[0].url;
    })
    .catch(err =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.get('/albums/:idArtist', (req, res) => {
  const { idArtist } = req.params;

  spotifyApi
    .getArtistAlbums(idArtist, { limit: 5 })
    .then(data => {
      const albums = data.body.items;
      res.render('albums', { albums });
    })
    .catch(err =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.get('/tracks/:idAlbum', (req, res) => {
  const { idAlbum } = req.params;

  spotifyApi
    .getAlbumTracks(idAlbum, { limit: 5, offset: 1 })
    .then(data => {
      const tracks = data.body.items;
      res.render('tracks', { tracks });
    })
    .catch(err =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
