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

// Get Rout that Displays a SearchBar
app.get('/', (req,res) => {
    res.render('index');
});

// Get rout that finds and returns all artists with Query String Name
app.get('/artist-search', async(req,res) =>{
    try {
        // Object Destructuring
        // const artist = req.query.artist is the same as the line before
        const {artist} = req.query;

        // Get all artists from Artist Api whith the same name as the searched one
        const allSearchedArtists = await spotifyApi.searchArtists({'artist_name': artist});
        res.render('artist-searched', {allSearchedArtists});
    }
    catch {
        console.log(error);
        res.render('error', { message: 'An error occurred' });
    }
});

// Get route to display albums for a specific artist
app.get('/albums/:artistId', async (req, res) => {
    try {
      const { artistId } = req.params;
  
      // Get artist's albums using Spotify API
      const artistAlbums = await spotifyApi.getArtistAlbums(artistId);
      const albums = artistAlbums.body.items;
  
      res.render('albums', { albums: albums });
    } catch (error) {
      console.log(error);
      res.render('error', { message: 'An error occurred' });
    }
  });

  
// Get route to display tracks for a specific album
app.get('/tracks/:albumId', async (req, res) => {
    try {
      const { albumId } = req.params;
  
      // Get album's tracks using Spotify API
      const albumTracks = await spotifyApi.getAlbumTracks(albumId);
      const tracks = albumTracks.body.items;
  
      res.render('tracks', { tracks: tracks });
    } catch (error) {
      console.log(error);
      res.render('error', { message: 'An error occurred' });
    }
  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
