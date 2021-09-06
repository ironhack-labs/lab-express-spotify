require("dotenv").config();

const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const path = require("path");
const hbs = require("hbs");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  if (!req.query.artist) {
    res.redirect("/");
  }
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      res.render("artist-search-results", { data: data.body.artists.items });
    })
    .catch((err) => console.log("Error when getting artists: ", err));
});

// Iteration #4
app.get("/albums/:albumId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.albumId)
    .then((data) => {
      res.render("albums", {
        data: data.body.items,
      });
    })
    .catch((err) => console.log("Error when getting albums: ", err));
});

// Iteration #5
app.get("/albums/tracks/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      console.log(data.body.items);
      res.render("tracks", {
        data: data.body.items,
      });
    })
    .catch((err) => {
      console.log("Error when getting tracks", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
