// Import dotenv config file
require('dotenv').config()

// Required libraries
const express       = require('express');
const hbs           = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const path          = require('path');


// Express app initialization
const app = express();

// Express setup
app.set('view engine', 'hbs');
app.set('layout', 'layout');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:

// Search (Home) page
app.get('/', (req, res, next) => {
  res.render('search');
});

// Search result page
app.get('/artists', (req, res, next) => {
  let artist = req.query.artist;

  // Preguntar por el body
  spotifyApi.searchArtists(artist)
    .then(data => {
      res.render('artists', {
        artists: data.body.artists.items
      })
    })
    .catch((error) => {
      console.log('Something went wrong!', error);
    });
});

// Get artist's albums
app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      res.render('albums', {
        albums: data.body.items
      })
    })
    .catch(error => {
      console.log('Something went wrong!', error)
    });
});

// Get selected album tracks
app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
      res.render('tracks', {
        tracks: data.body.items
      })
    })
    .catch(error => {
      console.log('Something went wrong!', error)
    });
});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
