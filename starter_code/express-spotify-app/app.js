var SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const app = express();
const hbs = require("hbs");
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

// Remember to paste your credentials here
var clientId = "f570d1aea7d44308900dd9136f292134",
  clientSecret = "78b6c81fc86d4dbd8671c6aa46279977";

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
  res.render("home");
});

app.get("/artists", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      data.body.artists.items.forEach(a => {
        a.image = a.images[0];
      });
      console.log(data.body.artists.items[0]);
      res.render("artists", { artists: data.body.artists.items });

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    });
});

app.listen(3000);
