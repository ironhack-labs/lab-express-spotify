var SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const prettyjson = require("prettyjson");
const bodyParser = require("body-parser");

// app.use(expressLayouts);
// app.set("layout", "layout/main-layout");

app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// My spotify clientCredentials
var clientId = "642165d248554d2a8ea359ca2882313c",
  clientSecret = "e683ed353ce64a289f04ad2359517db3";

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

// intialise random route
app.get("/", (req, res, next) => {
  res.render("index");
});

// Search for artists
app.get("/artists", (req, res, next) => {
  let artist = req.query.search;
  // console.log(artist);
  spotifyApi.searchArtists(artist).then(response => {
    res.render("artists", {
      name: response.body.artists.items[0].name,
      imageUrl: response.body.artists.items[0].images[0].url,
      artistId: response.body.artists.items[0].id
    });
    // console.log(response.body.artists);
  });
});

// Get albums
app.get("/albums/:artistId", (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then(response => {
    res.render("albums", {
      albums: response.body.items
    });
    console.log(response.body.items[0].images[0].url);
  });
});

// server started
app.listen(3000, () => {
  console.log("We are loggued... Let's go Nico!");
});
