var SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");

const app = express();
app.use(morgan("tiny"));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("layout", "layouts/main-layout");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
// Remember to paste here your credentials
var clientId = "72b1e4d9eeaf4d2e979ea6bedb0e1236",
  clientSecret = "259fd13d22ca42278ade2c30a37f9f36";

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

app.get("/artists", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      const artists = data.body.artists.items;
      console.log('Search artists by "artist"', data.body.artists.items[0]);
      res.render("artists", {
        artists
      });
    })
    .catch(err => {
      console.error(err);
    });
});

app.get("/albums/:id", (req, res) => {
  let artistid = req.params.id;
  spotifyApi
    .getArtistAlbums(artistid)
    .then(albumsRes => {
      const albumsList = albumsRes.body.items;
      console.log("************************************", albumsRes.body);
      res.render("albums", {
        albumsList
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(3000, () => {
  console.log("Up and running!");
});
