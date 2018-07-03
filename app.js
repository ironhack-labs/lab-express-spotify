var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');
const path = require("path");
const bodyParser = require('body-parser');

const app = express();
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + '/views/partials');
app.use(bodyParser.urlencoded({ extended: true }));

// Remember to paste here your credentials
var clientId = '9be8de53525c49da9c20c01f9030d023',
    clientSecret = '5b548a3833d042e5af76984d09ac7fa6';

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

app.get("/", (req, res, next) => {
  res.render("index");
});
app.get("/artists", (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      let artists = data.body.artists.items;
      res.render("artists", {artists});
    })
    .catch(err => {
      console.log(err);
    })
  
});
app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      let albumes = data.body.items;
      res.render("albums", {albumes});
    })
    .catch(err => {
      console.log(err);
    })
});
app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
      let tracks = data.body.items;
      res.render("tracks", {tracks});
    })
    .catch(err => {
      console.log(err);
    })
});
app.listen(3000);