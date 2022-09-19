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
app.get('/artist-search', async (req, res) => {
  const artistSearchData = await spotifyApi.searchArtists(req.query.artist);
  try {
    const arrayOfArtists = artistSearchData.body.artists.items;
    const searchQuery = req.query.artist;

    res.render('artist-search-result', { arrayOfArtists, searchQuery });
  } catch (err) {
    console.error(err);
  }
});

// albums
app.get('/albums/:artistId', async (req, res, next) => {
  try {
    const {
      body: { name: artistName },
    } = await spotifyApi.getArtist(req.params.artistId); //.catch((err) => console.error(err));

    const {
      body: { items: albumDataBodyArray },
    } = await spotifyApi.getArtistAlbums(req.params.artistId); //.catch((err) => console.error(err));

    res.render('albums', { albumDataBodyArray, artistName });
  } catch (err) {
    console.error(err);
  }
});

// tracks
app.get('/tracks/:albumId', async (req, res, next) => {
  try {
    const {
      body: {
        name: nameOfAlbum,
        tracks: { items: trackArray },
      },
    } = await spotifyApi.getAlbum(req.params.albumId);

    res.render('tracks', { trackArray, nameOfAlbum });
  } catch (error) {
    console.error(error);
  }
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
