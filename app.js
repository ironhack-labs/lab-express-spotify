require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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

/*app.get('/', (req, res) => {
    res.render('layout', { title: 'Home' });
  });*/
app.get("/", (req, res) => res.render("home"));

// Route to handle artist search
app.get('/artist-search', (req, res) => {
    const artistName = req.query.artist; 
  
    
    spotifyApi.searchArtists(artistName)
      .then(data => {
        console.log('The received data from the API: ', data.body.artists.items); // Log data for debugging
  
        // Render the results in the view
        res.render('artist-search-results', {
          artists: data.body.artists.items
        });
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
  });

  app.get('/albums/:artistId', (req, res) => {
    const artistId = req.params.artistId; 
  
    
    spotifyApi.getArtistAlbums(artistId)
      .then(data => {
        const albums = data.body.items; // Extract the albums from the response
        console.log('Albums data: ', albums); // Log data for debugging
  
        // Render the albums in the view
        res.render('albums', {
          albums: albums
        });
      })
      .catch(err => console.log('The error while searching albums occurred: ', err));
  });
  // app.js (continued)

// Route to handle viewing tracks by album
app.get('/tracks/:albumId', (req, res) => {
    const albumId = req.params.albumId; // Get the album ID from the URL parameter
  
    // Use Spotify API to get the album's tracks
    spotifyApi.getAlbumTracks(albumId)
      .then(data => {
        const tracks = data.body.items; // Extract the tracks from the response
        console.log('Tracks data: ', tracks); // Log data for debugging
  
        // Render the tracks in the view
        res.render('tracks', {
          tracks: tracks
        });
      })
      .catch(err => console.log('The error while searching tracks occurred: ', err));
  });
  
  
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
