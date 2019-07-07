const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const clientId = '943a95015ca3474ca0535856bdfac612';
const clientSecret = '975681dc5d3e4cfa917738eac6ed9c88';

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch((err) => {
    // console.log('Something went wrong when retrieving an access token', err);
  })

// the routes go here:
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artists', (req, res) => {
  const searchResult = req.query.artist;
  spotifyApi.searchArtists(searchResult)
    .then((data) => {
      const artists = data.body.artists.items;
      // console.log('The received data from the API: ', data.body.artists.items);
      res.render('artists', { artists });
    })
    .catch((err) => {
      // console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/albums/:id', (req, res) => {
  const searchId = req.params.id;
  spotifyApi.getArtistAlbums(searchId)
    .then((data) => {
      const albums = data.body.items;
      // console.log('The received data from the API: ', albums);
      res.render('albums', { albums });
    })
    .catch((err) => {
      // console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/tracks/:id', (req, res) => {
  const albumId = req.params.id;
  spotifyApi.getAlbumTracks(albumId)
    .then((data) => {
      const tracks = data.body.items;
      res.render('tracks', { tracks });
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));