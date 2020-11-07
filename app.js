require('dotenv').config();
const path = require("path");
const axios = require("axios");
const express = require('express');
const hbs = require('hbs');
require("dotenv").config(); 

hbs.registerPartials(__dirname + "/views/partials");

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
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

app.get("/", (req, res) => {res.render("index")});

app.get("/artist-search", (req, res) => {
  const { artistName } = req.query;

   spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      const { items } = data.body.artists;
      res.render("artist-search-results", { artists: items });
    })
    .catch((err) =>
    console.log("The error while searching artists occured: ", err)
    );
});

app.get("/albums/:id", (req, res) =>{
  const { id } = req.params;

  spotifyApi
    .getArtistAlbums(id)
    .then((data) => {
      const { items } = data.body;
      res.render("albums", { albums: items });
    })
    .catch((err) =>
    console.log("The error while searching artists occured: ", err)
    );
})

app.get("/tracks/:albumId", (req, res) =>{
  const { albumId } = req.params;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) =>{
      const { items } = data.body;
      res.render("tracks", {tracks: items});
    })
    .catch((err) =>
    console.log("The error while searching artists occured: ", err)
    );
})



app.listen(5000, () => console.log('My Spotify project running on port 5000 🎧 🥁 🎸 🔊'));
