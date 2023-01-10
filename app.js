const express = require('express');
const app = express();
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const port = process.env.PORT || 3000;
require('dotenv').config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.spotify_clientID,
  clientSecret: process.env.spotify_secret,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );
// require spotify-web-api-node package here:

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist-search', async (req, res) => {
  try {
    const data = await spotifyApi.searchArtists(req.query.search);
    // console.log('The received data from the API: ', JSON.stringify(data.body.artists.items,null,2));
    res.render('artist-search-results', { arr: data.body.artists.items });
  } catch (err) {
    console.log('The error while searching artists occurred: ', err);
  }
  // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
});

app.get('/albums/:artist', async (req, res) => {
  try {
    const { artist } = req.params;
    const data = await spotifyApi.getArtistAlbums(artist);
    // console.log(JSON.stringify(data.body, null, 2));
    res.render('albums', { albums: data.body.items });
  } catch (err) {
    console.log(`Error while getting albums for artist ->: ${err}`);
  }
});

app.get('/track/:album', async (req, res) => {
  try {
    const { album } = req.params;
    const data = await spotifyApi.getAlbumTracks(album, {
      limit: 15,
      offset: 1,
    });
    console.log(JSON.stringify(data.body.items, null, 2));
    res.render('tracks', { tracks: data.body.items });
  } catch (err) {
    console.log(`Error getting album tracks ->: ${err}`);
  }
});
app.listen(port, () =>
  console.log(`My Spotify project running on port ${port} 🎧 🥁 🎸 🔊`)
);
