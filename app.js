require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

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

// Helpers
hbs.registerHelper("isundefined", (value) => {
  return value !== undefined;
});

hbs.registerHelper("slug", (value) => {
  return value
    .toString() // Cast to string
    .normalize("NFD") // The normalize() method returns the Unicode Normalization Form of a given string.
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
});

// Our routes go here:

//INDEX
app.get("/", (req, res) => {
  res.render("index");
});

//ARTISTS
app.get("/artists", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((artistsData) => {
      res.render("artists", {
        artistsData: artistsData.body.artists.items,
        query: req.query.artist,
      });
    })
    .catch((err) => console.log("GET artists err: ", err.message));
});

//ALBUMS

app.get("/artists/:artistName/albums/", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.query.artistId)
    .then((albumsData) => {
      res.render("albums", {
        albumsData: albumsData.body.items,
        artistName: req.query.artistName,
      });
    })
    .catch((err) => console.log("GET albums err:  ", err));
});

// TRACKS
app.get("/artists/:artistName/albums/:albumName/tracks", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.query.albumId)
    .then((tracksData) => {
      res.render("tracks", {
        tracksData: tracksData.body.items,
        albumName: req.query.albumName,
      });
    })
    .catch((err) => {
      console.log("GET tracks err: ", err.message);
    });
});

//Server start

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
