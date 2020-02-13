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

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => res.render('index'));

app.get('/artist-search', (request, response) => {
  const term = request.query.term;

  spotifyApi
    .searchArtists(term)
    .then(data => {
      const recievedData = {
        artist: data.body.artists.items
      };
      // console.log('The received data from the API: ', recievedData);
      response.render('artist-search-results', recievedData);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (request, response, next) => {
  const id = request.params.artistId;

  spotifyApi
    .getArtistAlbums(id)
    .then(data => {
      const recievedData = {
        albums: data.body.items
      };
      // console.log('The received data from the API: ', recievedData.albums[0].images);
      response.render('albums', recievedData);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/album/:albumId', (request, response, next) => {
  const id = request.params.albumId;

  spotifyApi
    .getAlbumTracks(id)
    .then(data => {
      const recievedData = {
        album: data.body.items
      };
      console.log('The received data from the API: ', recievedData.album);
      response.render('tracks', recievedData);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
