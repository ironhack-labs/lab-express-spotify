var SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");

// Remember to paste here your credentials
var clientId = "07a8f995534544f49f7874c75ded1e00",
  clientSecret = "bc0703e9725a4ec799778458034b7c88";

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

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/artists", function(req, res) {
  console.log(req.query);
  let artist = req.query.artist;
  spotifyApi
    .searchArtists(artist)
    .then(data => {
        let name = data.body.artists.name;
      res.render("artists", {name});
      //console.log(data);
      console.log(data.body.artists);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/albums/:artistId", (req, res) => {
  // code
});

app.listen(3000, () => console.log("Port 3000!"));
