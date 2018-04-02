const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require("body-parser");
const spotifyApi = new SpotifyWebApi({
  clientId: "f53d912621d942c694520248cd84db89",
  clientSecret: "8ed48a0bcdc447faaba8e833a0bd60c0"
});
let data = {
  clientId: "f53d912621d942c694520248cd84db89",
  clientSecret: "8ed48a0bcdc447faaba8e833a0bd60c0"
};
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
    console.log("conectado a spotify");
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);
app.use(expressLayouts); 
app.set('layout', 'layouts/main-layout');
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// USE BODY PARSER
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.render("index", data);
});

// POST ROUTE
app.post("/homepage", (req, res) => {
    spotifyApi.searchArtists(req.body.artist, { limit: 10, offset: 20 }, (err, data) =>{
      if (err) {
        console.error('Something went wrong!');
      } else {
        console.log(data.body);
      }
    });
});

// Server Started
app.listen(3000, () => {
  console.log("My first app listening on port 3000!");
});
