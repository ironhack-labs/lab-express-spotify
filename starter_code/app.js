const SpotifyWebApi = require('spotify-web-api-node');
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const spotifyArtist = "https://api.spotify.com/v1/search?q=name:' + song + '%20artist:' + artist + '&type=track&limit=10;"


app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("layout", "layouts/main-layout");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

var clientId = '9bff06859f5c4b719d80cb626bfd9d7b',
clientSecret = '34d1aa5d42de4517be11660eb174f9d5';

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

app.get("/", (request, response, next) => {
  response.render("index");
})


app.post("/artists", (request, response, next) => {
  let searchArtist = request.query.term;
  spotifyApi.getArtistAlbums(searchArtist)
  .then(function(data) {
    console.log('Artist albums', data.query.term);
  }, function(err) {
    console.error(err);
  });
});


// Server Started
app.listen(3000, () => {
  console.log("Has been connected!");
});
