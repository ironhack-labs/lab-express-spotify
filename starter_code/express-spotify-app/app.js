const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", __dirname + "/views/layout/main-layout");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use(express.static("public"));


var SpotifyWebApi = require("spotify-web-api-node");

var clientId = "c90640206b474bedb38185a5e64987f8",
  clientSecret = "adde323ee6864a4190573001478f0a82";

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
app.get("/index", (req, res, next) => {
  res.render("index");
});

app.get("/artist", (req, res) => {
  console.log(artist);
  //let artistSearch = req.query.artist;
  spotifyApi
    .getArtists(["2hazSY4Ef3aB9ATXW7F5w3", "6J6yx1t3nwIDyPXk5xa7O8"])
    .then(
      function(data) {
        console.log("Artists information", data.body);
      },
      function(err) {
        console.error(err);
      }
    );
  res.render('artist');
});

app.listen(3000, () => {
  console.log("listening");
});
