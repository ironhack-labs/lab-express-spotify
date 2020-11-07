require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const { CLIENT_ID, CLIENT_SECRET } = process.env;

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

app.get('/', (request, response) => {
  response.render('home');
});

app.get('/artist-search', (request, response) => {
  const { artist } = request.query
  
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      const { items } = data.body.artists;
      response.render('artist-search', {artists: items});
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  
});

app.get('/albums/:id', (request, response) => {
  const { id } = request.params;

  spotifyApi
    .getArtistAlbums(id)
    .then((data) => {
      const { items } = data.body;
      response.render('albums', { albums : items });
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));

});

app.get('/tracks/:albumId', (request, response) => {
  const { albumId } = request.params;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const { items } = data.body;
      response.render('tracks', { tracks : items})
      console.log(items);
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));

});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
