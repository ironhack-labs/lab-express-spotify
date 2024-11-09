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
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:
// Home route to render a search form
app.get('/', (req, res) => {
    res.render('index'); // This renders a view called 'index.hbs'
  });
// Route to handle artist search results
app.get('/artist-search', (req, res) => {
    const artistName = req.query.artist; // get artist name from the query string
    
    spotifyApi
      .searchArtists(artistName)
      .then(data => {
        const artists = data.body.artists.items; // extract artist data
        res.render('artist-search-results', { artists }); // pass data to the view
      })
      .catch(err => console.log('Error while searching for artists:', err));
  });

  // Route to handle album display for a specific artist
  app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;  // Get artistId from the URL
    spotifyApi
      .getArtistAlbums(artistId)  // Use Spotify API method to get albums for the artist
      .then(data => {
        const albums = data.body.items;  // Extract albums data from the response
        const artistName = albums[0] ? albums[0].artists[0].name : '';  // Safely get the artist's name
        res.render('albums', { albums, artistName });  // Pass both albums and artistName to the view
      })
      .catch(err => console.log('Error while fetching artist albums:', err));
  });
  
  app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;  // Get albumId from the URL
  
    spotifyApi
      .getAlbum(albumId)  // Get the album details (including name)
      .then(albumData => {
        const albumName = albumData.body.name;  // Get album name from the response
        return spotifyApi.getAlbumTracks(albumId)  // Then get the tracks for that album
          .then(trackData => {
            const tracks = trackData.body.items;  // Extract tracks data from the response
            res.render('tracks', { tracks, albumName });  // Pass tracks and albumName to the 'tracks' view
          });
      })
      .catch(err => console.log('Error while fetching album tracks:', err));
  });
  
  
  
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
