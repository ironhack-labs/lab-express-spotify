require('dotenv').config();



const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const path    = require('path')

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


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
app.get('/', (req, res, next) => {
  res.render('index');
});

//Artists

app.get('/artist-search', (req, res) => {

  spotifyApi.searchArtists(req.query.ArtistName)
      .then(data => {

          let spotifyArtists = data.body.artists.items;

          // console.log('The received data from the API: ', spotifyArtists);

          res.render('artist-search-results', {spotifyArtists})
          


    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  
});

//Albums

app.get('/albums/:artistId', (req, res, next) => {
 
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {

      let album = data.body.items;

      console.log('Album:', album);

      res.render('albums',{album})
      


})
.catch(err => console.log('The error while searching artists occurred: ', err));

  
});

//Tracks
app.get('/tracks/:albumId', (req, res, next) => {
 
  spotifyApi.getAlbumTracks(req.params.albumId)
      .then(data => {

          let track = data.body.items;

          console.log('Album Track:', track);

          res.render('tracks', { track })
      
      })
      .catch(err => console.log('Something went wrong!', err));


});





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
