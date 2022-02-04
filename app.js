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
app.get("/", function (req, res, next) {
  res.render("home");
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist.toUpperCase())
    .then((data) => {
      //   console.log("artist here", data.body.artists);
      res.render("artist-search-results", { artists: data.body.artists });
    })
    .catch((err) => {
      console.log("sorry, error", err);
    });
});

app.get("/albums/:id", (req, res, next) => {
  console.log(req.params.id);

  spotifyApi.getArtistAlbums(req.params.id).then((data) => {
    console.log(data.body.items);

    res.render("albums", { albums: data.body });
  });
});

app.get("/tracks/:id", (req, res, next) => {
  console.log(req.params.id);

  spotifyApi.getAlbumTracks(req.params.id).then((data) => {
    console.log(data.body.items);

    res.render("tracks", { tracks: data.body });
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
