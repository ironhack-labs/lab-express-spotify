var SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

// Remember to paste your credentials here
var clientId = "d38ec50650f4406e9fab5321ca7fd23e",
  clientSecret = "69b5d1200fde4c5c9cdd6d5d3166d214";

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

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));

hbs.registerPartials(__dirname + "/views/partials");

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artists", (req, res, next) => {
  let { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      const data1 = data.body.artists.items;
      //console.log(data1);
      res.render("artists", { data1 });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/:albums", (req, res, next) => {
  let album  = req.params.artist;
  console.log(album);
  spotifyApi.getArtistAlbums(
    album,
    { limit: 10, offset: 20 },
    function(err, data) {
      if (err) {
        console.error("Something went wrong!");
      } else {
        console.log(data.body);
      }
    }
  );
});

const port = 3000;
app.listen(port);
console.log(`Listen to port ${port}`);
