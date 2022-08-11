require("dotenv").config();

const { PORT } = process.env;

const express = require("express");
const hbs = require("hbs");
const path = require("path");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
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

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/searchArtist", (req, res) => {
  const { artistName } = req.query;
  spotifyApi.searchArtists(artistName).then(
    function (data) {
      // console.log('Search artists by "Love"', data.body.artists.items);
      const { items } = data.body.artists;
      res.render("artist-search-results", { items, artistName });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi.getArtistAlbums(artistId).then(
    function (data) {
      const { items } = data.body;
      // console.log("Artist albums", data.body.items);
      res.render("albums", { items });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:albumId", (req, res, next) => {
  const { albumId } = req.params;
  spotifyApi.getAlbumTracks(albumId, { limit: 10, offset: 1 }).then(
    function (data) {
      console.log(data.body);
      const { items } = data.body;
      res.render("tracks", { items });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(3000, () =>
  console.log(`My Spotify project running on port ${PORT} 🎧 🥁 🎸 🔊`)
);
