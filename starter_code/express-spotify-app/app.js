const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
hbs.registerPartials(__dirname + "/views/partials");

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");

// SPOTIFY
var SpotifyWebApi = require("spotify-web-api-node");

// Remember to paste your credentials here
var clientId = "53596dcf73f44f81a482e00c18abee3a",
  clientSecret = "5a2084913d5a4220a5c541e77ba75003";

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

//ROUTES

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/artists", function(req, res) {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      var searchedList = data.body.artists.items;
      res.render("artist", {list: searchedList , title: req.query.artist + " results"});
    })
    .catch(err => {
      console.log("Erreur, déso");
    });
});

app.get("/albums/:artistID", function(req, res, next) {
  spotifyApi
    .getArtistAlbums(req.params.artistID)
    .then(data => {
      var artistalbum = data.body.items;
      res.render("albums", { albumslist: artistalbum });
    })
    .catch(err => {
      console.log("Erreur n°2, déso", err);
      next();
    });
});

// get tracks in an album
app.get("/tracks/:albumID", function(req, res, next) {
  spotifyApi
  .getAlbumTracks(req.params.albumID)
    .then(data => {
      var albumtracks = data.body.items;
      res.render("tracks", {trackslist: albumtracks });
    })
    .catch(err => {
      console.log("Erreur n°3, déso", err);
      next();
    });
});


// SERVEUR
app.listen(3000, () => console.log("Example app listening on port 3000!"));
