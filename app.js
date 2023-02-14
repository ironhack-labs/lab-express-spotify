require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:


const app = express();
const PORT = 3000;

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));

app.use(express.static(__dirname + '/public', { 
    setHeaders: function(res, path, stat) {
      res.set('Content-Type', 'text/css');
    }
  }));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

// Set up the index route
app.get('/public/styles/style.css', function(req, res) {
    res.sendFile(__dirname + '/public/styles/style.css');
});

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/artist-search', (req, res) => {
    const query = req.query.artist;
    spotifyApi
        .searchArtists(query)
        .then(data => {
          console.log('The received data from the API: ', data.body);
          const artists = data.body.artists.items.map(artist => ({
            id: artist.id,
            name: artist.name,
            img_url: artist.images.length ? artist.images[0].url : ''
          }));
          res.render('artist-search-results', {artists});
        })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res) => {
  const artistId = req.params.artistId;

  // use the Spotify API to get the artist's albums
  spotifyApi.getArtistAlbums(artistId)
    .then((data) => {
      // render the albums page with the album data
      res.render('albums', { albums: data.body.items });
    })
    .catch((err) => {
      console.log('Error getting artist albums:', err);
      res.status(500).send('Error getting artist albums');
    });
});

app.get('/albums/:albumId/tracks', (req, res, next) => {
  const albumId = req.params.albumId;
  spotifyApi.getAlbumTracks(albumId)
    .then(data => {
      const tracks = data.body.items;
      res.render('album-tracks', { tracks });
    })
    .catch(err => console.log('The error while getting tracks occurred: ', err));
});




app.listen(PORT, () => console.log(`My Spotify project running on port${PORT} 🎧 🥁 🎸 🔊`));


