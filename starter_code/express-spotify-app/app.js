var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');
const path = require("path");
const bodyParser = require('body-parser');
const app = express();


// Remember to paste your credentials here
var clientId = 'd38ec50650f4406e9fab5321ca7fd23e',
    clientSecret = '69b5d1200fde4c5c9cdd6d5d3166d214';

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

app.set("view engine", "hbs");
app.set("views",__dirname+"/views");
app.use(express.static(path.join(__dirname,"public")));

hbs.registerPartials(__dirname + "/views/partials");

app.get("/", (req, res, next) => {
  res.render("index");
});

app.post('/artists', (req,res,next) => {
  console.log("Entra aqui!");
  let artist = req.body.artist;
  console.log(artist);
  spotifyApi.searchArtists(artist)
    .then( data => {
      res.render("artists");
      console.log("Esto es lo que hay: ", data);
    })
    .catch( err => {
      console.log("Eeeerroooooor", err)
    })
})

const port = 3000;
app.listen(port);
console.log(`Listen to port ${port}`);




