var express = require("express");
var app = express();
var hbs = require("hbs");
var path = require("path");
var bodyParser = require("body-parser");
var SpotifyWebApi = require("spotify-web-api-node");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

hbs.registerPartials(`${__dirname}/views/partials`);

// Remember to paste here your credentials
var clientId = "bd3bdc03a2d74dac8e922124aaf48035",
  clientSecret = "9fe64272f17b469ebb4a519f27e099b9";

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

app.get("/", (req, res) => {
  res.render("search");
});

app.get("/artists", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      let artists = data.body.artists.items;

      res.render("artists", { artists });
    })
    .catch(err => {
      throw err;
    });
});

app.get("/albums/:id", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => {
      let albums = data.body.items;

      res.render("albums", { albums });
    })
    .catch(err => {
      throw err;
    });
});

app.get("/tracks/:id", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then(data => {
      let tracks = data.body.items;

      res.render("tracks", { tracks });
    })
    .catch(err => {
      throw err;
    });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
