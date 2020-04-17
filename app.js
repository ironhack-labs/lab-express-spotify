require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:
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
  
  app.get("/artist-search", (req , res) => {
    spotifyApi
  .searchArtists(req.query.artistName)
  .then(function(data) {
    const allArtists = data.body.artists.items.map(function(a) {
    return a
    })
    res.render("artist-search-results", {artists : allArtists})
  })
  
  .catch(err => console.log('The error while searching artists occurred: ', err));
  })
app.get("/albums/:id", (req,res) => {
  spotifyApi.getArtistAlbums(req.params.id)
  .then(function(data) {
     const allAlbums = data.body.items.map(function(a) {
       return a
     })
     res.render("albums",{ albums : allAlbums})
    },
    function(err) {
      console.error(err);
    }
  );
})
//  app.get("/albums/tracks/:id", (req,res) => {
//   spotifyApi.getArtistAlbums(req.param.id).then(
//     function(data) {
//       console.log('Artist albums', data.body);
//     },
//     function(err) {
//       console.error(err);
//     }
//   );
// })
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
