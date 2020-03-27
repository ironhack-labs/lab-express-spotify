require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');



// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/artist-search', (req, res) => {
    const queryString = req.query.q;
    spotifyApi
  .searchArtists(queryString)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    const artist = data.body.artists.items
    res.render('artist-search', {
        artist
    })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      console.log('The received data from the API: ', data.body);
      const albums = data.body.items;
      res.render('albums', {
          albums
      })
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
  });

app.get('/albums/tracks/:tracksId', (req, res, next) => {
    spotifyApi
    .getAlbumTracks(req.params.tracksId)
    .then(data => {
      console.log('The received data from the API: ', data.body);
      const tracks = data.body.items;
      res.render('tracks', {
          tracks
      })
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
  });

app.listen(5000, () => console.log('My Spotify project running on port 5000 🎧 🥁 🎸 🔊'));
