const express = require("express");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const app = express();
const path = require("path");
const clientId = "787bdebbecd943d6b33d58105f0bb63f";
const clientSecret = "75d90a5e66e54b21ab4058f93bc86944";
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(bodyParser.urlencoded({ encoded: true }));
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

app.get("/", (req, res, next) => res.render("index"));
app.post("/artists", (req, res, next) => {
  spotifyApi
    .searchArtists(req.body.artist)
    .then(data => {
      let album = data.body.artists.items;
      res.render("artists", { album });

      // console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});
app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      let albums = data.body.items;
      res.render("albums", { albums });
    })
    .catch(err =>
      console.error("The error while searching artists occurred: ", err)
    );
});
// the routes go here:

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
