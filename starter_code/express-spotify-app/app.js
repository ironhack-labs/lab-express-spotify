var SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const hbs = require("hbs");

// Remember to paste your credentials here
var clientId = "80e486d931c04ad082fd9674c01c2416",
  clientSecret = "0a18591a32544c558273a1197d9f9478";

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

hbs.registerHelper("json", function(context) {
  return JSON.stringify(context);
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

app.get("/", function(req, res) {
  res.render("index");
});

app.post("/artist", function(req, res) {
  let artist = req.body.artist;

  return spotifyApi.searchArtists(artist)
  .then(data => {
    console.log(data.body.artists.items);
    res.render("artist", { artists: data.body.artists.items });
  }).catch(err => {
    console.log (err);
  } )
});

app.get("/albums/:albumID", (req, res) => {
  const id = req.params.albumID;
  return spotifyApi.getArtistAlbums(id)
  .then(data => {
    console.log(data.body.items[0]);
    res.render("albums", { albums: data.body.items });
  }).catch(err => {
    console.log (err);
  })
  
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));
