const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
var SpotifyWebApi = require("spotify-web-api-node");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, 'public')));

// Remember to paste your credentials here
var clientId = "92d5540ea4bb44dc9b20e4056128a2e3",
  clientSecret = "ccb8ff0fd35440b092abf1bcda1dc104";

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

app.listen(3000,() => console.log('Spotify app listening on port 3000!'));

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

hbs.registerPartials(__dirname + "/views/partials");

app.get("/", function(req, res) {
  res.render("index");
});

// New route for /artists
app.get("/artists", function(req, res, next) {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      var searchArtists = data.body.artists.items;
      console.log(data.body.artists.items);

      res.render("artists", { list: searchArtists });
    })
    .catch(err => {
      console.log(err);
    });
});

// New route for /albums
app.get("/albums/:artistId", function(req, res, next) {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      var getArtistAlbums = data.body.items;
      console.log(getArtistAlbums);

      res.render("albums", { list: getArtistAlbums });
    })
    .catch(err => {
      console.log(err);
    });
});
