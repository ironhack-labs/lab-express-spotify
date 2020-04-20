require('dotenv').config();

// Express setup
const express = require('express');
const hbs = require('hbs');

// App setup
const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.locals.title = 'Spotify Index';

// API setup
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Getting access token
const port = spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Routes
app.get('/', (req, res, next) => {
  res.render('home.hbs');
});

app.get('/artist-search', (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.searchArtist)
    .then((data) => {
      console.log(data.body.artists);
      res.render('artist-search-results.hbs', {
        artists: data.body.artists.items,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect('home.hbs');
    });
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      console.log(data.body.items);
      res.render('albums.hbs', {
        albums: data.body.items,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect('home.hbs');
    });
});

app.get('/albums/tracks/:albumId', (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      res.render('tracks', {
        tracks: data.body.items,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/');
    });
});

// Server setup
app.listen(process.env.PORT, () =>
  console.log(
    `Spotify project running on port http://localhost:${process.env.PORT} 🎧 🥁 🎸 🔊`
  )
);
