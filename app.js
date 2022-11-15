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
  .then((data) => {
    console.log(data);
    spotifyApi.setAccessToken(data.body.access_token);
  })
  .catch((error) =>
    console.log("Something went wrong  retrieving the access token", error)
  );

// Our routes go here:

app.get('/', (req, res, next) => {
    res.render('index');
  });
  
app.get('/search-artist', (req, res, next) => {
    const search = req.query.search
    spotifyApi
  .searchArtists(search)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    res.render('albums', {artist: data.body.artists.items});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  });

  app.get('/albums/:id', (req, res, next) => {
    // .getArtistAlbums() code goes here
    const search = req.params.id
    spotifyApi
    .getArtistAlbums(search)
    .then(data => {
        console.log('The received data from the API: ', data.body.items);
        res.render('artist-search-results', {albums: data.body.items})
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
  });

  app.get('/tracks/:id', (req, res, next) => {
    const search = req.params.id
    spotifyApi
    .getAlbumTracks(search)
    .then(data => {
        console.log('The received data from the API: ', data.body.items);
        res.render('tracks', {tracks: data.body.items})
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
  });
  

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));