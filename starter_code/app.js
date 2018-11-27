const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
var SpotifyWebApi = require("spotify-web-api-node");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Remember to paste your credentials here
var clientId = "92d5540ea4bb44dc9b20e4056128a2e3",
  clientSecret = "ccb8ff0fd35440b092abf1bcda1dc104";

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

app.use(express.static(path.join(__dirname, "public")));

hbs.registerPartials(__dirname, + '/views/partials');

app.get("/", function(req, res) {
  res.render("index");
});

// New route for /artists
app.get("/artists", function(req, res, next) {
  res.render("artists"),
    spotifyApi.searchArtists(req.query.artist).then(data => {
      console.log(data.body.artists.items);
      res.render("artists", {data}).catch(err => {
        console.log(error);
      });
    });
});

app.listen(3000);
