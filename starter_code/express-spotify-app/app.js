const express = require("express");
const app = express();
const hbs = require("hbs");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const prettyJson = require("prettyjson");
const SpotifyWebApi = require("spotify-web-api-node");

const clientId = "f2fc2b6cdbc940a792196585a9d6cbab";
const clientSecret = "2bca47dfafb9465289f232192ee9250a";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "public"));
hbs.registerPartials(__dirname + "/views/partials");
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get("/artists", function(req, res) {
  console.log(req.query.artist);
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log(data.body.artists.items);
      const artists = data.body.artists.items;
      res.render("artists", { artists });
    })
    .catch(err => {
      console.log("Couldn´t find the selected artist", err);
    });
});

app.get("/albums/:artistId", function(req, res) {
  let id = req.params.artistId;
  spotifyApi
    .getArtistAlbums(id)
    .then(album => {
      let albums = album.body.items;
      console.log(albums);

      res.render("albums", { albums });
    })
    .catch(err => {
      console.log("Couldn´t find the selected album", err);
    });
});

app.get("/tracks/:albumId", (req, res) => {
  let id = req.params.albumId;

  spotifyApi.getAlbumTracks(id).then(
    track => {
      let tracks = track.body.items;
      res.render("tracks", { tracks });
    },
    err => console.log(err)
  );
});

const port = 3000;
app.listen(port, () => console.log(`Connected to ${port}`));
