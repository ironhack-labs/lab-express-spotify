var express = require("express");
var app = express();
var SpotifyWebApi = require("spotify-web-api-node");
const expressLayouts = require("express-ejs-layouts");

// Remember to paste here your credentials
var clientId = "c0e409f724564333a240dbd7d5ab5f75",
  clientSecret = "c4919a5eec624e31ba1973b395370c3b";

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

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
  // Retrieve a random chuck joke
  res.send("hello world");
});

app.listen(3000, () => {
  console.log("My Spotify API listening on port 3000!");
});
