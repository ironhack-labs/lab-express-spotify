require('dotenv').config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const path = require("path");

const clientId = process.env.CLIENTID,
 clientSecret = process.env.CLIENTSECRET;

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(path.join(__dirname, "/views/partials"));

// setting the spotify-api goes here:

// the routes go here:

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artists", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists);
      res.render("singer", data.body.artists);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:id", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => {
      console.log("Albums received data from the API: ", data.body);
      res.render("albums", data.body);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/tracks/:id", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then(data => {
      console.log("Tracks received data from the API: ", data.body);
      res.render("tracks", data.body);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
