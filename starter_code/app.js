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
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/artists", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      let searchArtists = data.body.artists.items;
      // console.log(data);
      res.render("artists", { list: searchArtists });
    })
    .catch(err => {
      console.log("An error occurred");
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      let album = data.body.items;
      res.render("albums", { artistAlbums: album });
    })
    .catch(err => {
      console.log("An error occurred", err);
      next();
    });
});

app.get("/tracks/:albumId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
      let tracksList = data.body.items;
      res.render("tracks", { track: tracksList });
    })
    .catch(err => {
      console.log("An error occurred", err);
      next();
    });
});

app.listen(3000);
