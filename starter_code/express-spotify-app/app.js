var express = require("express");
var app = express();
var layouts = require("express-ejs-layouts");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var ejs = require("ejs");
var SpotifyWebApi = require("spotify-web-api-node");

app.set("layout", "layouts");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static("public"));

// Remember to paste here your credentials
var clientId = "0b2961a81efe484bb8ff9b3730924c4b",
  clientSecret = "59ad3d4b144349e1aa0b508c39a20d74";

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
// First rute
app.get("/", (req, res, next) => {
  res.render("index");
});


//Start server
app.listen(3000, () => {
    console.log('My first app listening on port 3000!');
});
