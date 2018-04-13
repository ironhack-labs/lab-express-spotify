const express = require('express');
const app = express();
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

app.use(express.static(__dirname + "/public"));
//  use "body-parser" to parse (analyze) the from body and create "req.body"
// app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.set("layout", __dirname + "/views/layouts/layout");


hbs.registerPartials( __dirname + "/views/partials");



//  Routes
// ------------------------------------
app.get("/", (req, res, next) => {
  res.render("home-page")
});

app.get("/search", (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      console.log(req.query.artist);
      console.log(data.body.artists.items);
      res.render("artists", {artists: data.body.artists.items})
    })
    .catch(err => {
      console.log("marche po la");
    })
});
// ------------------------------------

// Remember to paste here your credentials
var clientId = '3b9838655abe44308cb237843fcd1da2',
    clientSecret = 'b8ce41e8a0ba484591c38d75fde7e9d8';

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

app.listen(3000, () => {
  console.log("App is running");
});