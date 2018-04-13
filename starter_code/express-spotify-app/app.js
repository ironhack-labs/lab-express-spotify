var SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const app = express();
const hbs = require("hbs");

// Middleware : app.use
app.use(express.static(__dirname + "/public"));
// setting global variables and configuration : app.set
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.set("layout", __dirname + "/views/layout.hbs");

// Remember to paste here your credentials
var clientId = "28d1df6bef974407b035b56aa5cb4291",
  clientSecret = "7ec1293a42b943f2bcd968ac73e896fa";

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

// setting global variables and configuration : app.set

// Routes : app.get => res.send or/and res.render

app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/artist", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      let artistList = data.body.artists.items;
      //   let imagesList = artistList.images;
      res.render("artists.hbs", { artistList });
    })
    .catch(err => {
      console.log("error", error);
    });
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      console.log(data.body.items);
      res.render("albums.hbs");
    })
    .catch(err => {
      console.log("error", error);
    });
});

app.listen(3000, () => {
  console.log("App is running!");
});
