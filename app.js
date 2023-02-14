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

// Route 1: form for displaying artists

app.get('/', (req, res) => {
    res.render('index', {
      title: 'Spotify Artist Search'
    });
  });
  

// Route 2: form for submit

app.get('/artist-search', (req, res) => {
    const query = req.query.artist;
  
    spotifyApi
      .searchArtists(query)
      .then(data => {
        const artists = data.body.artists.items;
  
        res.render('artist-search-results', {
          title: `Results for "${query}"`,
          artists
        });
      })
      .catch(err => {
        console.log('The error while searching artists occurred: ', err);
        res.render('artist-search-results', {
          title: `Error searching for "${query}"`,
          error: err
        });
      });
  });
  

// Route 3: Specific artist based on id

app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
    spotifyApi
      .getArtistAlbums(artistId)
      .then(data => {
        const albums = data.body.items;
        res.render('albums', { albums });
      })
      .catch(err => console.log('The error while retrieving albums occurred: ', err));
  });
  

// Route 4: Specific track based

app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;
  
    spotifyApi
      .getAlbumTracks(albumId)
      .then(data => {
        console.log('The received data from the API: ', data.body);
  
        // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        // You can extract the required information from the received data and render it to the tracks.hbs template.
        res.render('tracks', {
          tracks: data.body.items,
          albumId: albumId
        });
      })
      .catch(err => console.log('The error while getting album tracks occurred: ', err));
  });
  



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

