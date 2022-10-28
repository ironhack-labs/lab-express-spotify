require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

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

app.get("/", (req, res, next) =>{
    res.render("home");
})

app.get("/artist-search", (req, res, next) => {
    spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    //console.log('The received data from the API: ', data.body.artists.items[0].images[0].url);
    let allArtists = data.body.artists.items
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render("artists-search-results", {allArtists})

  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:id", (req, res, next) =>{
    spotifyApi.getArtistAlbums(req.params.id)
  .then(function(data) {
    //console.log('Albums information', data.body.items[0].images);
    let allAlbums = data.body.items;
    res.render("album-page", {allAlbums})
  }, function(err) {
    console.error(err);
  });

})


app.get("/tracks/:id", (req, res, next) =>{
    spotifyApi.getAlbumTracks(req.params.id, { offset : 1 })
  .then(function(data) {
    console.log(data.body);
    let allTracks = data.body.items
    res.render("tracks", {allTracks})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
