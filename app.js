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
    spotifyApi
    .searchArtists(req.query.search) // Le pasamos el parámetro "name" del item
    .then(data => {
      console.log('fejof', data.body.artists); // Buscamos en el console.log donde están los álbumes

      res.render('artist-search-results', { result: data.body.artists.items}); // Renderizamos la página artists-search-results (primer arg) y le pasamos el "resultado" que queremos, que en nuestro caso, son los albumes
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(
        err => console.log('The error while searching artists occurred: ', err));
  });

  app.get('/albums/:id', (req, res) => {
    spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => {
      res.render('albums', { result: data.body.items}); // Renderizamos la página artists-search-results (primer arg) y le pasamos el "resultado" que queremos, que en nuestro caso, son los albumes
      console.log('Artist albums', data.body);
    })
    .catch(
      err => console.log('The error while searching albums occurred: ', err));
  });

  app.get('/traks/:id', (req, res) => {
    spotifyApi
    .getAlbumTracks(req.params.id, { limit : 5, offset : 1 })
    .then(data => {
      res.render('traks', { result: data.body.items}); // Renderizamos la página artists-search-results (primer arg) y le pasamos el "resultado" que queremos, que en nuestro caso, son los albumes
      console.log('Artist albums', data.body.items);
    })
    .catch(
      err => console.log('The error while searching albums occurred: ', err));
  });





app.listen(3001, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
