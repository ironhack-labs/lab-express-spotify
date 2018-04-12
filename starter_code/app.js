//Client ID cb5656b584b449a3a5ce69a447c65b29
//Client Secret 910014b2a107423d9d2c7029908cab7f

const express = require("express");
const bodyParser = require('body-parser');
var SpotifyWebApi = require('spotify-web-api-node');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const app = express();
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('layout', 'layouts/main-layout')
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Remember to paste here your credentials
var clientId = 'cb5656b584b449a3a5ce69a447c65b29',
    clientSecret = '910014b2a107423d9d2c7029908cab7f';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.use(morgan('dev'));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts)
app.set("layout", "layouts/main-layout")

app.set("views", __dirname + "/views")
app.set("view engine", "ejs");

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.post("/artist", function(req, res, next){
  spotifyApi.searchArtists(req.body.term.split(" ")[0])
  .then((response) => {
      let artist = req.body.term;
      let artistInfo=response.body.artists.items
      if (artistInfo.length>0){

      res.render("artist", {artistInfo: artistInfo, artist: artist})
      } else{

      res.render("index")
      }
  }).catch((err) => {
      res.render("index")
  });
});

app.get("/artist", function(req, res, next){
  res.render("index")
});

app.get("/albums", function(req, res, next){
  res.render("index")
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then((response) => {
      let artistName = response.body.items[0].artists[0].name;
      let albumInfo = response.body.items
      res.render("albums", {artistName: artistName, albumInfo: albumInfo})
  }).catch((err) => {
      res.render("index")
  });
});

app.get('/tracks/:albumId', (req, res) => {

  spotifyApi.getAlbumTracks(req.params.albumId)
  .then((response) => {
      let trackList = response.body.items
      res.render("tracks", {trackList: trackList})
  }).catch((err) => {
      res.render("index")
  });
});

app.get("/", function(req, res, next){
  res.render("index")
});


app.listen(3000, function(err){
    if(err) console.log(err);
    console.log('Mi servidor funciona')
});