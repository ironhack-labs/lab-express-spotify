var SpotifyWebApi = require('spotify-web-api-node');
const express = require("express");
const app = express();
const hbs = require("hbs");
const bodyParser = require("body-parser");

// Remember to paste here your credentials
var clientId = 'dd5164d6b6454e459ba466fce789eb9a',
    clientSecret = '8dbf9276305446f88760292d9ad5248f';

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

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials/");

//Routes
//-------------------------
app.get("/", (req, res, next) => {
    res.render("home-page.hbs");
})


app.get("/artists", (req, res, next) => {
    spotifyApi.searchArtists(req.query.search_query)
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.locals.artistsResults = data.body.artists.items
      res.render("artists.hbs")
    //   console.log(data.body.artists.items[0].images[0].url)
    })
    .catch(err => {
      console.log("This artist does not exist", err);
    })
})


app.listen(3000, () => {
    console.log("Your app is working");
})