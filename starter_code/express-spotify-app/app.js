const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));
hbs.registerPartials(__dirname + "/views/partials");

app.get("/", (req, res, next) => {
  res.render("index");
});

var SpotifyWebApi = require("spotify-web-api-node");

var clientId = "39ada7d118d049af90f8b1e1e31fabbf",
  clientSecret = "685d98e9274f4fe2bc4091b53e956f86";

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

app.get("/artists", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      let artistList = data.body.items;
      console.log(data.body);
      res.render("artists", { artistList });
    })
    .catch(() => {
      console.log("There is something wrong here");
    });
});

app.get("/albums/:id", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(function(data) {
      albumList = data.body.items;
      res.render("albums", { albumsList });
    })
    .catch(() => {
      console.log("There is a another thing wrong");
    });
});

app.get("/tracks/:id", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then(function(data) {
      tracksList = data.body.items;
      res.render("tracks", { tracksList });
    })
    .catch(() => {
      console.log("And here another one");
    });
});

app.listen(3000);
