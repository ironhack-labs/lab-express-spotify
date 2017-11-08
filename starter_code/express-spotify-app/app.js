'use strict';

const express = require('express');
const app = express();
const SpotifyWebApi = require('spotify-web-api-node');

const clientId = 'fedee460fb2546fc9e445ddbd51e3c7e',
    clientSecret = '10bbe6e8f09b415e8348d7f7cbc102cb';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

// Views set up
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");

// Routes
app.get('/', (req, res, next) => {
  res.render('index');
  console.log("welcome html");
});

app.get('/artists', (req, res, next) => {
  spotifyApi
   .searchArtists(req.query.artist)
   .then(result => {
     let data = {
       artist: result,
     };
     res.render("artists", data);
   })
    .catch(err => {
      console.log(`Ooops something went wrong while searching the artists -> ${err}`);
   });
});

app.get('/albums/:artistId', (req, res) => {
  console.log(req.params.artistId);
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(albums => {
    let data = {
      album: albums,
    };
    res.render("albums", data);  })
   .catch(err => {
     console.log(`Ooops something went wrong while searching the albums -> ${err}`);
  });
});

app.get('/tracks/:albumId', (req, res) => {
  console.log(req.params.albumId);
  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then(tracks => {
    let data = {
      track: tracks,
    };
    res.render("tracks", data);  })
   .catch(err => {
     console.log(`Ooops something went wrong while searching the albums -> ${err}`);
  });
});


// Start server
app.listen(3000, () => {
  console.log("Spotify Express running on port 3000!");
});
