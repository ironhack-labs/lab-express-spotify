const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

// controller
app.get("/", function(req, res) {
  console.log(req);
  res.render("index.hbs");
});


// artist-name is in [] because it contains -
app.get("/artists", (req, res) => {
  spotifyApi.searchArtists(req.query['artist-name'])
    .then(data => {
      data.body.artists.items.forEach((a) => {
        a.image = a.images[0]   //gives back only the first image
    })
      console.log(data.body.artists.items);
      res.render('artists', {artists: data.body.artists.items});
    })
    .catch(error => {
      console.log(error);
    });
});

var SpotifyWebApi = require("spotify-web-api-node");

// Remember to paste your credentials here
var clientId = "33e2ea134d1e4c29baf9bf3eb9c74c92",
  clientSecret = "b64cbb8e8f8e4104baf6dab72756cdab";

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

//starting our app
app.listen(3000, () => console.log("Example app listening on port 3000!"));
