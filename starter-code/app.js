require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();


//MIDDLEWARE
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

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


// ROUTES
app.get('/', (req, res) => {
  res.render('index');
})

app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      const artistList = data.body.artists.items; //you make it a const var 
      res.render('artist-search-results', {artistList}) //but when you render it the {} make it an object
  })
    .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/albums/:id', (req, res) => {
  spotifyApi
  .getArtistAlbums(req.params.id)
  .then(data => {
    const albumsList = data.body.items;
    res.render('albums', {albumsList}) 
  })
  .catch(err => console.log('The error while searching albums occurred: ', err))
});

app.get('/albums/tracks/:id', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.id)
  .then(data => {
    const trackList = data.body.items;
    res.render('tracks', {trackList})
  })
  .catch(err => {console.log('The error while searching album tracks occurred: ', err);
  })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
