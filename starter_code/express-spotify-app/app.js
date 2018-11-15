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
      res.render("artists", { data1 });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/:albums/:id", (req, res, next) => {
  let artistChoosen = req.params.id;
  spotifyApi
    .getArtistAlbums(artistChoosen)
    .then(data => {
      const data2 = data.body.items;
      res.render("albums", { data2 });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/:viewTracks/:id", (req, res, next) => {
  let artistChoosen = req.params.id;
  spotifyApi
    .getAlbumTracks(artistChoosen)
    .then(data => {
      console.log(data);
      const data3 = data.body.items;
      res.render("viewTracks", { data3 });
    })
    .catch(err => {
      console.log(err);
    });
});

const port = 3000;
app.listen(port);
console.log(`Listen to port ${port}`);
