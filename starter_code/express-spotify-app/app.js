var SpotifyWebApi = require("spotify-web-api-node");
// dvar spotifyAPI = new SpotifyWebApi();
const express = require("express");
const app = express();
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Remember to paste here your credentials
var clientId = "8b516eb922b640b286643f110c8053ba",
  clientSecret = "8c96e275e34842219a928ef24d076a49";

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artists", (req, res, next) => {
  let artist = req.query.artist;

  spotifyApi
    .searchArtists(artist)
    .then(artist => {
      let results = artist.body.artists.items;
      console.log(results);
      res.render("artists", {
        artist: results
      });
    })
    .catch(err => {
      console.log("error", err);
    });
});

// Server Started
app.listen(3000, () => {
  console.log("My first app listening on port 3000!");
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
