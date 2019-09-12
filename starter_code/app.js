require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
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

app.get("/", (req, res, next) => {
  res.render("index")
})

//  app.post("/artists", (req, res, next) => {
//   const artist = req.body.artist;
//   spotifyApi
//   .searchArtists("/artists")
//   .then(data => {
//     console.log("The received data from the API: ", data.body);
//     res.render.artist
//   })
//   .catch(err => {
//     console.log("The error while searching artists occurred: ", err);
//   });
//  })

app.post("/artists", (req, res, next) => {
  spotifyApi
  .searchArtists(req.body.artist)
  .then(data => {
    // console.log("The received data from the API: ", data.body);
    const artist = data.body.artists.items;
    res.render(("artists"), {artist})
  })
  .catch(err => {
    console.log("The error while searching artists occurred: ", err);
  });
 })

app.get("/albums/:id", (req, res, next) => {
  // console.log(req.params.id)
  spotifyApi.getArtistAlbums(req.params.id)
  .then(data => {
    const albums = data.body.items;
    res.render("albums", {albums})
  }, function(err) {
    console.error(err);
  });  
});

app.get("/tracks/:albumsId", (req, res, next) => {
  // console.log(req.params.id)
  spotifyApi.getAlbumTracks(req.params.albumsId)
  .then(data => {
    const tracks = data.body.items;
    res.render("tracks", {tracks})
  }, function(err) {
    console.error(err);
  });  
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
