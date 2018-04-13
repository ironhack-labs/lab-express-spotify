const express = require("express");
const app = express();
const hbs = require("hbs");

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.set("layouts", __dirname + "/views/layouts.hbs");
app.set("view options", { layout: "layouts" });

//Routes
app.get("/", (req, res, next) => {
  res.render("home");
});

// // app.get("/search", function(req, res, next) {
//   if (req.query.q === "artist") {
//     res.render("artists");
//   } else {
//     res.render("error-page");
//   }
// });

app.get("/search", function(req, res, next) {
  console.log(req);
  spotifyApi
    .searchArtists(req.query.q)
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.locals.artists = data.body.artists.items;
      console.log(res.locals.artists);
      res.render("artists.hbs");
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
      res.render("error-page.hbs");
    });
});

// app.get("/albums/:artistId", (req, res) => {
//   spotifyApi.getArtistAlbums(req.query.);
//   .then();
// });

var SpotifyWebApi = require("spotify-web-api-node");

// Remember to paste here your credentials
var clientId = "4c36266652fd4006b13744ec88e98f8b",
  clientSecret = "178f9572085341acb1b703d767a8cff3";

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

app.listen(3000, () => {
  console.log("App is running");
});
