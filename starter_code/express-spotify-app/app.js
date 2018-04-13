var SpotifyWebApi = require('spotify-web-api-node');
const express = require("express");
const hbs = require("hbs");

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.set("view options", { layout: "layouts/layout.hbs" });

app.use(express.static(__dirname + "/public"));

// Remember to paste here your credentials
var clientId = '3e1f77ac518f46f0816f2cdd8a194bfd',
    clientSecret = '59a27f2a083b4947828864a502a7397b';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get("/", (req, res, next) => {
  res.render("home-page");
});

app.get("/artists", (req, res, next) => {
  spotifyApi.searchArtists(req.query.artistName)
    .then(data => {
      res.render("artists", {
        artists: data.body.artists
      });
    })
    .catch(err => {
      console.log("Error", err)
    });
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId, {limit: 10})
  .then(data => {
    // res.send(data);
    res.render("albums", {
      albums: data
    });
  })
  .catch(err => {
    console.log("ERROR", err)
  })
});

app.get("/tracks/:albumId", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId, {limit: 5})
  .then(data => {
    // res.send(data);
    res.render("tracks", {
      tracks : data.body.items
    });
  })
  .catch(err => {
    console.log("ERROR", err);
  });
});

app.listen(3000, () => {
  console.log("Start your server!!!");
})