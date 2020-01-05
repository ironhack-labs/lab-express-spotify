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
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });


// the routes go here:


app.get('/', (req, res, next) => {
  res.render('home')
})


app.get('/artists', (req, res, next) => {
  // const artist = req.query.artists
  let search = req.query;
    spotifyApi
      .searchArtists(search.artist)
      .then(function(data) {
        res.render('artists', data.body.artists);
        })
        .catch(err => {
            console.log('The error while searching artists occurred: ', err);
          });
      })
      
      
app.get('/albums/:artistId', (req, res, next) => {
  let id = req.params;
    spotifyApi  
      .getArtistAlbums(id.artistId)
      .then(function(data) {
        res.render('albums', data.body);
      })
      .catch(err => {
        console.log('The error while searching artists occurred: ', err);
      });
  })


app.get('/tracks/:albumsId', (req, res, next) => {
  let id = req.params;
    spotifyApi
    .getAlbumTracks(id.albumsId)
    .then(function(data) {
      res.render('tracks', data.body);
      // res.send(data.body)
    })
    .catch(err => {
      console.log(err);
})
})
  







      // app.get("/tracks/:albumId", (req, res, next) => {
      //   let id = req.params;
      //   console.log(id)
      //   spotifyApi.getAlbumTracks(id.albumId, { limit : 10, offset : 0 })
      //   .then(function(data) {
      //     res.render('tracks', data.body);
      //     // res.send(data.body);
      //   }, function(err) {
      //     console.error(err);
      //   });
      // });
      
app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
