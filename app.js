/* jshint esversion: 9*/
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
app.get('/layout', (req, res) => {
    res.render('layout');
});

//Artist search rout
app.get('/artist-search', function(req, res) {
    const artistName = req.query.artist;
    spotifyApi
      .searchArtists(artistName)
      .then(data => {
        console.log('The received data from the API: ', data.body);
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        const artists = data.body.artists.items;
        res.render('artist-search-results', {artists});
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
});

//Albums rout
app.get('/albums/:artistId', (req, res, next) => {
  const artistId = req.params.artistId;
  // .getArtistAlbums() code goes here
  spotifyApi
  .getArtistAlbums(artistId)
  .then(data => {
    console.log('Artist albuns:', data.body.items);
    const albums = data.body.items;
    res.render('albums', {albums});
    })
    .catch(error => console.log('An error ocorred getting the albums information:', error));
});

//Tracks rout
app.get('/albums/tracks/:tracksId', (req, res, next) => {
  const tracksId = req.params.tracksId;
  // .getArtistAlbums() code goes here
  spotifyApi
  .getAlbumTracks(tracksId)
  .then(data => {
    console.log('Album tracks:', data.body);
    const tracks = data.body.items;
    res.render('tracks', {tracks});
  })
  .catch(error => console.log('An error ocorred getting the tracks information:', error));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
