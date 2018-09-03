const express = require('express');
const app = express();
const hbs = require('hbs');
const path    = require("path");

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '6bfd1a0c3a6248f39b555b3d352ff5b5',
    clientSecret = '847d8231f3f74a3d9ec76656b1591874';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

//ROUTES

app.get("/", (request, response, next) =>{
  response.render("homepage.hbs");
});

app.get("/artists", (request, response, next) =>{
  const { artists } = request.query;
  console.log(request.query);

  spotifyApi.searchArtists(artists)
  .then(data => {
  response.locals.artistResults = data.body.artists.items;
    response.render("search-results.hbs");
  // response.json(data);
  
  })
  .catch(error => {
    console.log(error)
  })
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums("artistId")
  .then(data => {
    response.json(data);
  })
  .catch(error => {
    console.log(error)
  })
});



app.listen(3000, () => {
  console.log("we are ready to go!");
});