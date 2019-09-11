require('dotenv').config()
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");


// require spotify-web-api-node package here:
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
//adding API
const spotifyApi = new SpotifyWebApi({
    // clientId: "87439de1fe9d4bd99795083126aba1bb",
    // clientSecret: "95b805c5f0054a6e9e6a58a442334894"
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
      console.log("Something went wrong when retrieving an access token", error);
    });

// the routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artists', (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.artistName).then(data => {
      console.log("The received data from the API: ", data.body);
      res.render('artists', {artist: data.body.artists.items});
  })
  .catch(err => {
    console.log("The error file searching artists occurred: ", err);
  });
});

app.get('/albums/:albumId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.albumId)
  .then(function(data) {
    console.log('Artist albums', data.albumId);
      res.render('album', {albums: data.body.items});
  }, function(err) {
    console.error(err);
  });
});

app.get('/tracks/:trackId', (req,res, next)=> {
  spotifyApi.getAlbumTracks(req.params.trackId)
  .then(function(data) {
    // console.log(data);
    console.log("----->>>",data.body.items.id);
    console.log("=========>", data.body.items);
    res.render('tracks', {tracks: data.body.items});
    
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

// app.get(`/albums/:artistId`, (req, res, next) => {
//   req.get('id');
//   spotifyApi.getArtist(``)
//   .then(function(data) {
//     console.log('--------------Artist information-----------', data.body.id);
//     console.log('--------------Artist information-----------');
//     res.render('artists', {album: data.body.id});
//   }, function(err) {
//     console.error(err);
//   });
// });

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
