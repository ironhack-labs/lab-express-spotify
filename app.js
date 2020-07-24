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

app.get("/home", (req, res, next) => {
  res.render("home");
});

app.get("/artist-search", (req, res) => {
  console.log(req.query);
  spotifyApi
    .searchArtists(req.query.artistName)
    .then((data) => {
      console.log(data.body);
      res.render("artists-search-results", { artist: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then((data) => {
    console.log(data.body.items.artists);
    res.render("albums", { album: data.body.items });
  });
});

app.get("/tracks/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId, { limit: 5, offset: 1 })
    .then((data) => {
      //console.log(data.body.items);
      res.render("tracks", { track: data.body.items });
    });
});

app.listen(3005, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
