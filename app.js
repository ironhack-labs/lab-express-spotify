//------------------------2023_07 SOLVED SECOND TIME------------------------------------------
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
  const { artist } = req.query;
  console.log(artist);

  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

      const {
        artists: { href, items, limit, next },
      } = data.body;
      console.log("items[1]", items[1]);
      res.render("artist-search-results", { items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;
  console.log("artist Id", artistId);
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const { href, items: albums, limit } = data.body;
      console.log("Albums", albums);
      res.render("albums", { albums });
    })
    .catch((err) => {
      console.log("Error loading albums", err);
    });
});

app.get("/tracks/:albumId", (req, res, next) => {
  const { albumId } = req.params;
  console.log("album Id", albumId);
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const { href, items: tracks, limit } = data.body;
      console.log("tracks", {tracks});
      res.render("tracks", {tracks});
    })
    .catch((err) => {
      console.log("Error loading albums", err);
    });
});

app.listen(3005, () =>
  console.log("My Spotify project running on port 3005 🎧 🥁 🎸 🔊")
);