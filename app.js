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
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist-search', (req, res) => {
  console.log(req.query);
  spotifyApi.searchArtists(req.query.artist).then(
    (data) => {
      const arrayOfArtists = data.body.artists.items;

      res.render('artist-search-result', { arrayOfArtists });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    (data) => {
      console.log('########################', data.body.items[0]);
      const dataBodyArray = data.body.items;

      res.render('albums', { dataBodyArray });
    },
    function (err) {
      console.error(err);
    }
  );
  console.log(req.params.artistId);
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
