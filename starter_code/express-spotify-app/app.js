const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
//hbs.registerPartials(__dirname + '/views/layouts')

var SpotifyWebApi = require("spotify-web-api-node");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));

// Remember to paste here your credentials
var clientId = "9ab277fc673c4634953aeb48456d80f0",
  clientSecret = "db83c19e19784e378de79278dc9d6931";

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
  res.render("index");
});

app.get("/artist", (req, res, next) => {
  console.log(req.query.artist);
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      const artist = data.body.artists.items;
      res.render("artist", { artist });
      console.log(artist);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/album/:id", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => {
      console.log(data.body.items);
      res.render("album", { data });
    })
    .catch(err => {
      console.log(`ERROR: ${err} +`);
    });
});

app.get("/songs/:idSongs", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.idSongs)
    .then(dataSongs => {
      res.render("songs", { dataSongs });
    })
    .catch(err => {
      console.log(`ERROR: ${err}`);
    });
});

app.listen(3000);