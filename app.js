require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
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
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  const { search } = req.query;
  spotifyApi
    .searchArtists(search)
    .then((data) => {
      res.render("artist-search-results", { result: data.body.artists.items });
    })
    .catch((err) => console.log("Error while searching artists:", err));
});

app.get("/albums/:search", (req, res, next) => {
  const { search } = req.params;
  spotifyApi
    .getArtistAlbums(search)
    .then((data) => {
      res.render("albums", { result: data.body.items });
    })
    .catch((err) => console.log("Error while searching artists albums:", err));
});

app.get("/tracks/:search", (req, res, next) => {
  const { search } = req.params;
  spotifyApi
    .getAlbumTracks(search)
    .then((data) => {
      res.render("tracks", { result: data.body.items });
    })
    .catch((err) => console.log("Error while searching artists tracks:", err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
