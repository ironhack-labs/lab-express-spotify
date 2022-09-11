require('dotenv').config();

const express = require('express');
const app = express();
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

// // 1. require the body-parser
// const bodyParser = require('body-parser');
// // 2. let know your app you will be using it
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true }));

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
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

// Index
app.get('/', (req, res) => {
  res.render('index');
});

// artist-search
app.get('/artist-search', (req, res) => {
  console.log(req.query.artist);
  spotifyApi.searchArtists(req.query.artist).then(
    (data) => {
      const arrayOfArtists = data.body.artists.items;
      const searchQuery = req.query.artist;
      res.render('artist-search-result', { arrayOfArtists, searchQuery });
    },
    function (err) {
      console.error(err);
    }
  );
});

// albums
app.get('/albums/:artistId', (req, res, next) => {
  // I also want to get the artists name. If it´s for example only a
  // feature artist, that name is not necessary included in the album, so...
  let artistName;
  console.log(req.params);
  spotifyApi.getArtist(req.params.artistId).then(
    function (data) {
      artistName = data.body.name;
      console.log(artistName);
    },
    function (err) {
      console.error(err);
    }
  );

  spotifyApi.getArtistAlbums(req.params.artistId).then(
    (data) => {
      const albumDataBodyArray = data.body.items;
      res.render('albums', { albumDataBodyArray, artistName });
    },
    function (err) {
      console.error(err);
    }
  );
});

// tracks
app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi
    .getAlbum(req.params.albumId)
    .then(function (data) {
      console.log(data.body);
      const trackArray = data.body.tracks.items;
      const nameOfAlbum = data.body.name;
      res.render('tracks', { trackArray, nameOfAlbum });
    })
    .catch(function (error) {
      console.error(error);
    });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
