require("dotenv").config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

hbs.registerPartials(path.join(__dirname, "views", "partials"));

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
// app.use(express.static("public/images"));

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
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      const artists = data.body.artists.items;
      res.render("artist-search", {
        artists,
      });
    })
    .catch((error) => console.error(error));
});

app.get("/albums/:name/:id", (req, res, next) => {
  const { name } = req.params;
  const { id } = req.params;
  spotifyApi.getArtistAlbums(id).then((data) => {
    const albums = data.body.items;
    res.render("albums", { name, albums });
  });
});

app.get("/tracks/:name/:id", (req, res, next) => {
  const { name } = req.params;
  const { id } = req.params;
  spotifyApi.getAlbumTracks(id).then((data) => {
    const tracks = data.body.items;
    res.render("tracks", {
      name,
      tracks,
    });
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
