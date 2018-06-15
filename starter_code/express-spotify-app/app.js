const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));

var SpotifyWebApi = require("spotify-web-api-node");

// Remember to paste here your credentials
var clientId = "054a29bfd6b84c8eb49e0fefd433e3ba",
  clientSecret = "7fa7d1a9c7694f838b205d1092386b3e";

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

app.get("/", (req, res, next) => {
  res.render("homepage");
});

app.get("/artists", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      const artists = data.body.artists.items;
      console.log(artists[0].images);
      res.render("artists", { artists });
    })
    .catch(err => {
      console.log("This artist does not exist.");
    });
});

app.listen(3000);
