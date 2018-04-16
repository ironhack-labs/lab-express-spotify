const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");
const port = 3000;

hbs.registerPartials(`${__dirname}/views/partials`);

hbs.registerHelper('dotdotdot', function(str) {
  if (str.length > 30)
    return str.substring(0,30) + '...';
  return str;
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);


// Remember to paste here your credentials
const clientId = "00b8947df0fd4e8d8b073f1c001bd7f5",
  clientSecret = "48104987673442298c3330c1e23dac90";

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
  res.render("index");
});

app.get("/artists", (req, res) => {
  let { artist } = req.query;

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      let artists = data.body.artists.items;

      res.render("artists", { artists });
    })
    .catch(err => {
      console.error(err);
    });
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    data => {
      let albums = data.body.items;
      res.render("albums", {albums});
    },
    err => {
      console.error(err);
    }
  );
});
app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId).then(
    data => {
      let tracks = data.body.items;
      res.render("tracks", {tracks});
    },
    err => {
      console.error(err);
    })
});

app.listen(port, () => console.log(`Connection established at port ${port}`));
