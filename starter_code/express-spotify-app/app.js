const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const expressLayouts = require('express-ejs-layouts');

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set('layout', __dirname + '/views/layout/main-layout');

app.use(bodyParser.urlencoded({ extended: true }));

// BASIC MORGAN DEV CONTROL.
app.use(morgan('dev'));

app.use(express.static('public'));

app.get("/index",(req,res) => {
  res.render("index");
})


//SPOTIFY CODE.
var SpotifyWebApi = require('spotify-web-api-node');

var clientId = '44707323c6794632bd91f58ef537e7c9',
    clientSecret = '88637417c7444dcdb7c13d7133398460';

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

// WEBAPP CODE
app.post("/artist", (req,res) => {
  spotifyApi.searchArtists(req.body.artist)
  .then(function(data) {
    res.render("artist", {response: data.body.artists.items})
  }, function(err) {
    console.error(err);
  });
});

app.get('/albums', (req, res) => {
  spotifyApi.getArtistAlbums(req.query.id)
  .then(function(data) {
    res.render("albums", {response: data.body.items})
  }, function(err) {
    console.error(err);
  });
});

app.get('/tracks', (req, res) => {
  spotifyApi.getAlbumTracks(req.query.id, { limit : 8})
  .then(function(data) {
    res.render("tracks", {response: data.body.items})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

app.listen(3000, () => {
  console.log("listening");
});
