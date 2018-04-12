var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');
const path = require("path");
const bodyParser = require('body-parser');
// Remember to paste here your credent
const app = express();
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + '/views/partials');
app.use(bodyParser.urlencoded({ extended: true }));

var clientId = '6f09765959de468fa3b625a68760b132',
    clientSecret = '619734ae074b42e592611f4f7edc0612';

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
  res.render("home");
});
app.get("/artists", (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      let artists = data.body.artists.items;
      console.log(data.body.artists.items);
      artists.forEach(e => {
        console.log(e.images);
      });
      res.render("artists", {artists});
    })
    .catch(err => {
      console.log(err);
    })
  
});
app.listen(3000);