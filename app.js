require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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

app.get('/artist-search', (req, res) => {
  let { artist } = req.query;

  spotifyApi.searchArtists(artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      res.render('artist-search-results', { data: data.body.artists.items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:albumId', (req, res, next) => {
  const albumId = req.params.albumId;

  spotifyApi.getArtistAlbums(albumId)
    .then(data => {
      console.log('The received data from the API: ', data.body.items);
      res.render('albums', { data: data.body.items });
    })
    .catch(err => {
      console.log('The error while searching albums occurred: ', err);
      next(err);
    });
});

app.get('/tracks/:tracksId', (req,res, next) =>{
  const tracksId = req.params.tracksId;

  spotifyApi.getAlbumTracks(tracksId)
  .then(function(data) {
    console.log('The received data from the API:', data.body.items);
    res.render('tracks',{data: data.body.items});
})
.catch(err => {
  console.log('The error while searching albums occurred:', err);
  next(err);
});
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

