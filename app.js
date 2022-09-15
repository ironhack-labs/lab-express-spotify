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
    res.render('home');
  });

  // search by query (artist)
  app.get('/artist-search', (req, res) => {
    spotifyApi
  .searchArtists(req.query.artist)
  .then(async data => {
    console.log('Hola: ', data.body.artists.items[0]);
    res.render('artist-search-result', { artists: data.body.artists.items });
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  });


  // search by id (albums)

  app.get('/albums/:artistId', (req, res, next) => {

    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(async (data) => {
        console.log('Artist albums ', data.body.items[0]);
        res.render('albums', { albums: data.body.items, artistId: req.params.artistId });
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
      });


  // show tracks of an album

  app.get('/albums/:artistId/:albumId', (req, res) => {

    spotifyApi
    .getAlbumTracks(req.params.albumId, { limit : 5, offset : 1 })
    .then(async (data) => {
        console.log('Tracks album ', data.body.items[0]);
        res.render('tracks', { tracks: data.body.items });
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
      });



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
