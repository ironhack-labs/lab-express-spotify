"use strict";

//Setting up the modules
const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const ejs = require("ejs");
const morgan = require("morgan");
const prettyjson = require("prettyjson");

//Spotify credidentials
const clientId = "fd36143d1c0f4c3c854c59639471d451",
  clientSecret = "c48b6b4ae4904687af978787daca7697";

//Accessing the modules
const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

//set up views
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static("public"));

//Routes
app.get("/", (req, res, next) => {
  res.render("index");
});

app.post("/artists", (req, res) => {
  let artist = req.body.artist;
  spotifyApi.searchArtists(artist).then(
    function(data) {
      res.render("artists", data);
    },
    function(err) {
      throw err;
    }
  );
});

app.get("/albums/:artistId", (req, res) => {
  console.log(req.params.artistId);
  // spotifyApi.getArtistAlbums(artistId).then(
  //   function(data) {
  //     let artistAlbums = data.body.items;
  //     console.log(artistAlbums);
  //     // res.send(albums);
  //   },
  //   function(err) {
  //     console.log(err);
  //   }
  // );
  // res.render("view-albums");
});

//Set up server at port 3000
app.listen(3000, () => {
  console.log("My first app listening on port 3000!");
});
