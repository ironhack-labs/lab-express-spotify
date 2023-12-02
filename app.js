const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// Load environment variables
require("dotenv").config();

const app = express();

// Set up view engine and static files
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Set up Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Get Spotify access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
    console.log("Spotify access token received and set");
  })
  .catch((error) => {
    console.log("Error retrieving Spotify access token", error);
  });

// Render index page
app.get("/", (req, res) => {
  res.render("index");
  console.log("OK");
});

// Route for artist search
app.get("/artist-search", (req, res) => {
  const searchTerm = req.query.theArtistName;

  spotifyApi
    .searchArtists(searchTerm)
    .then((data) => {
      const artists = data.body.artists.items;
      res.render("artist-search-results", { artists, searchTerm });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// Get Artist by ID
app.get("/albums/:artistId", (req, res, next) => {
  const artistId = req.params.artistId;

  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const albums = data.body.items;
      res.render("albums", { albums });
    })
    .catch((err) =>
      console.log("The error while getting artist albums occurred: ", err)
    );
});

// Get Artist's Albums by ID
app.get("/tracks/:albumId", (req, res, next) => {
  const albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const tracks = data.body.items;
      res.render("tracks", { tracks });
    })
    .catch((err) =>
      console.log("The error while getting album tracks occurred: ", err)
    );
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`My Spotify project running on port ${PORT} 🎧 🥁 🎸 🔊`)
);
