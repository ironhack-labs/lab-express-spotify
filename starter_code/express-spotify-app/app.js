var SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");

// Remember to paste here your credentials
var clientId = "07a8f995534544f49f7874c75ded1e00",
  clientSecret = "bc0703e9725a4ec799778458034b7c88";

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
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));
hbs.registerPartials(__dirname + "/views/partials");

app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/artists", function(req, res) {
  //console.log(req.query);
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      let searchedArtist = data.body.artists.items;
      res.render("artists", { searchedArtist });
      //console.log(searchedArtist);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
      album = data.body.items
      console.log(album)
      res.render('albums', {album})
    },
    function(err) {
      console.error(err);
    }
  );
});
app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(function(data) {
      tracks = data.body.items
      res.render('tracks', {tracks})
    },
    function(err) {
      console.error(err);
    }
  );
});


app.listen(3000, () => console.log("Port 3000!"));
