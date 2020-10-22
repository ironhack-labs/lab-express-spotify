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
  let artist = req.query.artist;
  spotifyApi
  .searchArtists(artist)
  .then(data => {
    res.render('artist-search', {artist: data.body.artists.items})
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
    ;
    //res.render('artist-search');
  });

  app.get('/albums/:id', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.id)
    .then(albums => {console.log(albums.body.items[0]); res.render('albums', {albums: albums.body.items})})
    .catch(error => console.log('error'));
  });

  app.get('/tracks/:id', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.id)
    .then(tracks => {console.log(tracks.body.items[0]); res.render('tracks', {tracks: tracks.body.items})})
    .catch(error => console.log('error'));
  });


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
