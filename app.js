require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index", { doctitle: "Home" });
});

// Search for artists
app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      res.render("artist-search-results", { data: data.body.artists.items });
      // console.log(data.body.artists.items);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// Get albums from artist search
app.get("/albums/:albumId", (req, res) => {
  spotifyApi
  .getArtistAlbums(req.params.albumId).then(
    function (data) {
      res.render("albums", { data: data.body.items });
    },
    function (err) {
      console.error("The error while searching albums occurred: ", err);
    }
  );
});

// Get tracks from album
app.get("/tracks/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      res.render("tracks", { data: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
  spotifyApi
  .getArtistAlbums(req.params.albumId).then(
    function (data) {
      res.render("tracks", { data: data.body.items });
    },
    function (err) {
      console.error("The error while searching albums occurred: ", err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
