const SpotifyWebApi = require('spotify-web-api-node');
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");

app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("layout", "layouts/main-layout");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

var clientId = 'f883156ea0f845f1a5bda11d9b581800',
clientSecret = '3be0c3159ff14f3d9a2b604a4a3607fc';

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
  let searchTerm = request.body.term;
  spotifyApi.searchArtists(searchTerm)
  .then(function(data) {
    console.log(`Search artists by ${searchTerm}, ${data}`);
  }, function(err) {
    console.error(err);
  });
   response.render("artists", {searchTerm})
});

// Server Started
app.listen(3000, () => {
  console.log("My first app listening on port 3000!");
});






