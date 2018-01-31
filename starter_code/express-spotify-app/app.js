const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const SpotifyWebApi = require('spotify-web-api-node');

app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("layout", "layouts/main-layout");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Remember to paste here your credentials
const clientId = '36dd17ad10284c0cb6c0efe6d3794cb7',
    clientSecret = 'dd8880068bfe44fa92b8086c4a96614f';

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

app.get("/",(req, res, next) => {
  res.render("index");
});

app.get("/artists",(req, res) => {
  let artist = req.query.artistSearch

  spotifyApi.searchArtists(artist)
  .then(function(data) {
    console.log(`Search artists by ${artist}`, data.body.artists.items[0]);
    let artistData = data.body.artists.items[0];
    res.render("artists", {artist, artistData})
  }, function(err) {
    console.error(err);
  });
})

app.get("/albums",(req, res, next) => {
  let artist = req.query.artistSearch

  spotifyApi.searchArtists(artist)
  .then(function(data) {
    console.log(`Search artists by ${artist}`, data.body.artists.items[0]);
    let artistData = data.body.artists.items[0];
    res.render("albums", {artist, artistData})
  }, function(err) {
    console.error(err);
  });
  console.log(artist)
});
// Server Started
app.listen(3000, () => {
  console.log("My Spoti app listening on port 3000!");
});
