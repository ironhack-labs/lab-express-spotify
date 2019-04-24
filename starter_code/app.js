const express = require("express");
const hbs = require("hbs");
const app = express();
require("dotenv").config();

const SpotifyWebApi = require("spotify-web-api-node");

//const Spotify = require("spotify-web-api-js");
//const s = new Spotify();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret
});

console.log(spotifyApi);

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:
app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/artists", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.input)
    .then(data => {
      res.render("artists", { data: data.body.artists.items });
      console.log("The received data from the API: ", data);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:identification", (req, res, next) => {
  //console.log("The ID is", req.params.identification);
  spotifyApi
    .getArtistAlbums(req.params.identification)
    .then(data => {
      res.render("albums", { items: data.body.items });
      //console.log("Artist albums", { data: data.body.artists.items });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/tracks/:albumID", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumID)
    .then(data => {
      res.render("tracks", { items: data.body.items });
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(3000, _ => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
