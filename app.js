require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
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

app.get('/artistSearchResults', (req, res, next) => {
  const artist = req.query.artist;

  spotifyApi
.searchArtists(artist)
.then(data => {
  res.render('artistSearchResults', {artists:data.body.artists.items});
})
});

app.get('/albums/:id', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.id)
  .then(artistAlbums => {
      res.render('albums', {albums:artistAlbums.body.items})
  })
})

  app.get('/tracks/:id', (req, res, next) => {
    spotifyApi
    .getAlbumTracks(req.params.id, { limit: 5, offset: 1 })
    .then((albumsTracks) => {
      res.render('tracks', {tracks: albumsTracks.body.items});
  })
    .catch(err => console.log(err));
  });


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
