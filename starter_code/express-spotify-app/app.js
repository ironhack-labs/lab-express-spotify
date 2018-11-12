const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");

var SpotifyWebApi = require("spotify-web-api-node");
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));
hbs.registerPartials(__dirname + "/views/partials");

var clientId = "4c0a5b0bebd8473d82d5b08464e1412c",
  clientSecret = "df51849d29eb4598b072a7b3836c997f";

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

app.get("/:artist", (req, res, next) => {
  let { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      console.log(data);
      const data1 = data.body.artists.items;
      res.render("artist", { data1 });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/albums/:id", (req, res, next) => {
  let finalArtist = req.params.id;
  console.log(finalArtist);
  spotifyApi
    .getArtistAlbums(finalArtist)
    .then(data => {
      console.log(data);
      const data2 = data.body.items;
      res.render("albums", { data2 });
    })
    .catch(err => {
      console.log(err);
    });
});
app.get("/viewTracks/:id", (req, res, next) => {
  let finalArtist = req.params.id;
  spotifyApi
    .getAlbumTracks(finalArtist)
    .then(data => {
      console.log(data);
      const data3 = data.body.items;
      res.render("viewTracks", { data3 });
    })
    .catch(err => {
      console.log(err);
    });
});
app.listen(3000, () => {
  console.log("listen on port 3000");
});
