const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(bodyParser.json())

// Remember to paste here your credentials
const clientId = "84e0096d2ff04878934522ddf052b7b4",
  clientSecret = "a4e03bc39e774f05a12be1c18072cc00";

const spotifyApi = new SpotifyWebApi({
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

spotifyApi.searchArtists('Love')
  .then(function(data) {
    console.log('Search artists by "Love"', data.body);
  }, function(err) {
    console.error(err);
  });


app.get("/", (req, res) => {
  res.render("index");
});

app.post("/artist", (req, res) => {
let artist = req.query.artist

  spotifyApi.searchArtists(artist)
    .then(function(data) {
      console.log(`search artist by ${artist}`, data);

      

      res.render('artist', { artists: data.body.artists.items });
    }, function(err) {
      console.error(err);
    });
});



app.listen(3000);
