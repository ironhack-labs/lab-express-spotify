const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");

const SpotifyWebApi = require("spotify-web-api-node");

// Remember to paste here your credentials
const clientId = "4368578915a341a5885e02aa3ddf40e4",
  clientSecret = "641c21598af44acf8b10db34f58bbba9";
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(path.join(__dirname, "public")));

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

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log(data.body.artists.items);
      res.render("artist", { data });
    })
    .catch(err => {
      console.log(err);
    });
  console.log();
});

app.get("/albums/:id", (req, res) => {
  spotifyApi.getArtistAlbums(req.params.id).then(
    data => {
      console.log("Artist albums", data.body.items);
      res.render("album", { data });
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:id", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.id, { limit : 5, offset : 1 })
  .then(data => {
    console.log(data.body);
    res.render("tracks", { data });
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

app.listen(3000, () => {
  console.log("Iniciado");
});
