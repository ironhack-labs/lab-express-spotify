var SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
// Remember to paste here your credentials
var clientId = "698d9a0ec4044bdfbd2d49c110bb4377",
  clientSecret = "b2a8eea3329b4a5fab688818e9478c55";

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));

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

app.get("/artist", function(req, res) {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log(data.body.artists.items);
      res.render("artist");
    })

    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    });
});

app.listen(3000);
