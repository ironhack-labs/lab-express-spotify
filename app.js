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


/* Routes */
app.get('/', (req, res, next) => {
  res.render('home')
})


app.get('/artist-search', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artistName)
    .then(data => {
      const itemsArtist = data.body.artists.items
      // console.log(itemsArtist);
      res.render('artist-search-results', { itemsArtist })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get('/albums/:albumId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.albumId)
    .then(data => {
      const itemsAlbum = data.body.items;
      // console.log(itemsAlbum);
      // console.log(data.body.items[0].artists[0].name)
      res.render('albums', { itemsAlbum })
    })
    .catch(err => console.log('The error while searching album occurred: ', err));
})


app.get('/albums/:albumId/tracks/:trackId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.trackId)
    .then(data => {
      const itemsTrack = data.body.items;
      // console.log(itemsTrack);
      res.render('tracks', { itemsTrack })
    })
    .catch(err => console.log('The error while searching tracks occurred: ', err));
})


// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
