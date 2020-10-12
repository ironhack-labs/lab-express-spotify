require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const app = express();

// Imports Spotify API.
const SpotifyWebApi = require("spotify-web-api-node");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Spotify API set-up.
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token.", error)
  );

// Home page.
app.get("/", (req, res, next) => {
  res.render("home-page");
});

// Artist search.
app.get("/artist-search", (req, res, next) => {
  const artist = req.query.search;

  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      const info = data.body.artists.items;
      res.render("artist-search-results", { info });
    })
    .catch((err) => console.log("Error.", err));
});

// Artist albums.
app.get("/albums/:artistId", (req, res, next) => {
  const artistId = req.params.artistId;

  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const info = data.body.items;

      res.render("albums", { info });
    })
    .catch((err) => {
      console.log("Error.", err);
    });
});

// Album tracks.
app.get("/tracks/:albumId", (req, res, next) => {
  const albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const info = data.body.items;
      console.log(info);
      res.render("tracks", { info });
    })
    .catch((err) => {
      console.log("Error.", err);
    });
});

// Port.
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
