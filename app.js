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
  res.render("home");
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.search)
    .then((data) => {
      res.render("artist-search-results", { artist: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistName", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistName)
    .then((data) => {
      res.render("albums", { albums: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.get("/album/tracks/:trackNames", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.trackNames)
    .then((data) => {
      res.render("tracks", { tracks: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching tracks occurred: ", err)
    );
});

app.listen(4000, () =>
  console.log("My Spotify project running on port 4000 🎧 🥁 🎸 🔊")
);
