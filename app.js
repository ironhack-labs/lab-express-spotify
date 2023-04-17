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

 app.get('/', (req, res) => {
        
        res.render('index');
 });



app.get('/artist-search', (req, res) => {
    const artistName = req.query.q;
    spotifyApi.searchArtists(artistName)
      .then((data) => {
        console.log("received data from api", data.body)
        console.log(data.body.artists.items)
        const searchResults = data.body.artists.items
        res.render('artist-search-results', { searchResults });
      })
      .catch(err => {
        console.log('Error while searching for artist:', err);
        // res.send('Error occurred');
      });
  });


  app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
    spotifyApi.getArtistAlbums(artistId)
      .then(data => {
        const albums = data.body.items;
        res.render('albums', { albums });
      })
      .catch(err => {
        console.log('Error getting artist albums:', err);
        res.send('Error occurred');
      });
  });


  app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;
    spotifyApi.getAlbumTracks(albumId)
      .then(data => {
        const tracks = data.body.items;
        res.render('tracks', { tracks });
      })
      .catch(err => {
        console.log('Error while retrieving tracks:', err);
        res.send('Error occurred');
      });
  });
  
  
  




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
