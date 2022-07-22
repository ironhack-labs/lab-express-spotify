require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: false }));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    // console.log(data);
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Routes

// Home Page
app.get("/", (req, res) => {
  res.render("home");
});

// Display Artist Search
app.get("/artist-search", (req, res, next) => {
  const { search } = req.query;

  spotifyApi
    .searchArtists(search)
    .then((data) => {
      // console.log("The received data from the API: ", data.body);
      const artists = data.body.artists.items;
      res.render("artist-search-results", { artists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );

  console.log("artist-search");
});

// View Albums
app.get("/albums/:id", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((data) => {
      // console.log("The received data from the API: ", data.body);
      const albums = data.body.items;
      res.render("album", { albums });
    })
    .catch((err) => {
      console.log("The error while viewing album occurred: ", err);
    });
});

// View Tracks
app.get("/tracks/:id", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then((data) => {
      // console.log("The received data from the API: ", data.body);
      const tracks = data.body.items;
      res.render("tracks", { tracks });
    })
    .catch((err) => {
      console.log("The error while viewing tracks occurred: ", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
