require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

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

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Our routes go here:
app.get("/", (req, res, next) => res.render("main"));

// Get Artists
app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      const artists = data.body.artists.items;
      res.render("artist-search-results", { artists: artists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// Get Albums
app.get("/albums/:id", (req, res) => {
  const artistId = req.params.id;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const albums = data.body.items;
      res.render("albums", { albums: albums });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// Get Tracks

app.get("/tracks/:id", (req, res) => {
  const tracksId = req.params.id;
  spotifyApi
    .getAlbumTracks(tracksId)
    .then((data) => {
      const tracks = data.body.items;
      res.render("tracks", {
        tracks: tracks,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
