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

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:

app.get('/', (req, res) => {
  res.render('index.hbs');
});

app.get('/artist-search', async (req, res) => {
  try {
    const spotifyArtist = await spotifyApi.searchArtists(req.query.artist);
    res.render('artistSearch.hbs', {
      spotifyArtist: spotifyArtist.body.artists.items,
    });
  } catch (err) {
    console.log('The error while searching artists occurred: ', err);
  }
});

app.get('/albums/:artistId', async (req, res) => {
  try {
    const spotifyAlbums = await spotifyApi.getArtistAlbums(req.params.artistId);
    res.render('albums.hbs', {
      albums: spotifyAlbums.body.items,
    });
  } catch (err) {
    console.log('The error while searching artists occurred: ', err);
  }
});

app.get('/tracks/:id', async (req, res) => {
  try {
    const spotifyTrack = await spotifyApi.getAlbumTracks(req.params.id);
    res.render('tracks.hbs', {
      tracks: spotifyTrack.body.items,
    });
  } catch (err) {
    console.log('The error while searching artists occurred: ', err);
  }
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
