require('dotenv').config({ path: './config.env' });

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const path = require('path');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

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
  res.render('index');
});

app.get('/artist-search', async (req, res) => {
  const artist = await spotifyApi.searchArtists(req.query.artist);
  //   console.log('The received data from the API: ', artist.body.artists.items);
  const artistArr = artist.body.artists.items;
  res.render('artist-search-results', { artistArr });
});

app.get('/albums/:artistId', async (req, res) => {
  const albums = await spotifyApi.getArtistAlbums(req.params.artistId);
  //   console.log(albums.body.items[0].name);
  const albumsArr = albums.body.items;
  res.render('albums', { albumsArr });
});

app.get('/tracks/:albumId', async (req, res) => {
  const tracks = await spotifyApi.getAlbumTracks(req.params.albumId);
  const tracksArr = tracks.body.items;
  console.log(tracksArr);
  res.render('tracks', { tracksArr });
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
