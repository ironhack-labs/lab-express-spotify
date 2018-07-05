const express = require("express");
const hbs = require("hbs");
const path = require("path");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");

//hbs.registerPartials(__dirname + '/views/partials');

// Remember to paste here your credentials
let clientId = "65e9f0d3cf8a42f9a9d492631a56dea7",
  clientSecret = "eec6f3f118e54283b199f1b763a7cf9a";

let spotifyApi = new SpotifyWebApi({
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

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
hbs.registerPartials(__dirname + "/views/partials");

app.get("/", (req, res, next) => {
  res.render("index", { title: "Home" });
});

app.get("/artists", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      res.render("artists", {
        title: "Artists",
        artists: data.body.artists.items
      });
    })
    .catch(err => {
      console.log(`Payo no encontrado: ${err}`);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      res.render("albums", { title: "Albums", albums: data.body.items });
    })
    .catch(err => {
      console.log(`El hamster no corrio suficiente para encontrarlo: ${err}`);
    });
});

app.get("/tracks/:albumId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
      res.render("tracks", { title: "Tracks", tracks: data.body.items });
    })
    .catch(err => {
      console.log(`Conejito sin pilas: ${err}`);
    });
});

app.listen(3000);
