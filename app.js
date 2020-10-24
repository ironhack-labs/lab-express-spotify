require('dotenv').config();

const { query } = require('express');
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node'); // require spotify-web-api-node package

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


//Le decimos que en la dirección base, "/"; nos renderize el index.hbs
app.get("/", (req, res, next) => {
    res.render("index.hbs");
});

//
app.get("/artist-search", (req, res, next) => {
    console.log(req.query.name)
    spotifyApi.searchArtists(req.query.name)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    res.render('artist-search-results', {artists: data.body.artists.items});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get("/albums/:id", (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.id)
    .then(function(data) {
    
    let imagesAlbums =  data.body.items;

    console.log('artist', imagesAlbums, 'artist')
    res.render("albums", {datos: data.body.items});
  }, function(err) {
    console.error(err);
  });
});

app.get("/tracks/:id", (req, res, next) =>{
    spotifyApi.getAlbumTracks(req.params.id)
    .then(function(data) {
      console.log(data.body);
      res.render("tracks.hbs", {datos: data.body.items});
    }, function(err) {
      console.log('Something went wrong!', err);
    });
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
