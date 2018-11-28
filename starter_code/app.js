var SpotifyWebApi = require("spotify-web-api-node");

// Remember to paste your credentials here
var clientId = "b0a39705f71b408ca9d5890e1a6b8574",
  clientSecret = "7a3d0209af944c39a508b5f07251faec";

var spotifyApi = new SpotifyWebApi({
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

const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/artists", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      var searchArtists = data.body.artists.items;
      // console.log(data);
      res.render("artists", { list: searchArtists });
    })
    .catch(err => {
      console.log("A error occurred");
    });
});

app.listen(3000);
