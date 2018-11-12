const express = require("express");
const hbs = require("hbs");
var SpotifyWebApi = require("spotify-web-api-node");
const app = express();
const path = require('path')
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + "/views/partials");

var clientId = "47588c328876436cbe7bb158c10dfebc",
  clientSecret = "6429a53f90ce424fba5a00752c8e1570";

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

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/:artist", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      const artist = data.body.artists.items;
      res.render("artist", { artist });
    })
    .catch(err => {
      console.log("error", err);
    });
});

app.get("/albums/:id", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => {
      const album = data.body.items;
      console.log();
      res.render("albums", { album });
    })
    .catch(err => console.log("ERROR"));
});

app.get("/songs/:id", (req, res) => {
   
  spotifyApi.getAlbumTracks(req.params.id).then(data => {
     const song=data.body.items
     console.log(song)
    res.render("songs",{song});
  }).catch(err=>console.log("ERROR",err));
});

app.listen(3000, () => console.log("Ready"));
