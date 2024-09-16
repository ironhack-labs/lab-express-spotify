require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

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

// setting the spotify-api goes here:

// Our routes go here:

// GET /
app.get("/", (req, res, next) => {
  res.render("home-page");
  console.log("home page is in the house");
});

app.get("/artist-search", (req, res, next) => {
  console.log(req.query);
  spotifyApi
    .searchArtists(req.query.artistName)
    .then((data) => {
      res.render("artist-search-results", data.body);
      console.log('Search by "Love"', data.body);
    })

    .catch((err) => {
      console.error(err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  console.log(req.params.artistId);
  // const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      const albums = data.body.items;
      res.render("albums", { albums });
      console.log("Artist albums", data.body);
    })

    .catch((err) => {
      console.error(err);
    });
});

app.get("/tracks/:albumId", (req, res, next) => {
  const albumId = req.params.albumId;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const tracks = data.body.items;
      res.render("tracks", { tracks });
      console.log(tracks);
    })

    .catch((err) => {
      console.error(err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
