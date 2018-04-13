const express = require("express");
const app = express();
const hbs = require("hbs");

const SpotifyWebApi = require("spotify-web-api-node");



app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.set("view options", {layout: "/layouts/main-layout"});

app.use(express.static('public'));

hbs.registerPartials(__dirname + "/views/partials");




// Remember to paste here your credentials
const clientId = "7bbe0b36af8246c996714fb3cfefe862",
    clientSecret = "75fb4970838f4eb0a83b9b6ef6649d2d";

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  }, function(err) {
    console.log("Something went wrong when retrieving an access token", err);
});


//Routes!-----------

app.get("/", (req, res, next) => {
  res.render("home-page");
});

app.get("/artists", (req, res, next) => {
    
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      //console.log(data.body.artists.items);
      res.locals.artists = data.body.artists.items
      res.render("artist-page");
    })
    .catch(err => {
      console.log("ERROR 🤪 ", err)
    })
}); 

app.get('/albums/:artistId', (req, res, next) => {
  res.render("albums-page");
});


//--------------------
app.listen(3000, function () {
  console.log('App Ready')
})