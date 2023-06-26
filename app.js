require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Set up view engine
app.set("view engine", "hbs");

// Middleware
app.use(express.static(__dirname + "/public"));

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", (req, res) => {
  const artist = req.query.artist;

  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      const artists = data.body.artists.items;
      res.render("artist-search-results", { artists });
    })
    .catch((err) => {
      console.log("The error while searching artists occurred: ", err);
      // res.render("error");
    });
});

app.get("/albums/:artistId", (req, res) => {
  const artistId = req.params.artistId;

  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const albums = data.body.items;
      res.render("albums", { albums });
    })
    .catch((err) => {
      console.log("The error while retrieving albums occurred: ", err);
      res.render("error");
    });
});

app.get("/tracks/:albumId", (req, res) => {
  const albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const tracks = data.body.items;
      res.render("tracks", { tracks });
    })
    .catch((err) => {
      console.log("The error while retrieving tracks occurred: ", err);
      res.render("error");
    });
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log("Server is running on http://localhost: ", port);
});
