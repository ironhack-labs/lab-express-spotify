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

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  console.log(req.query);
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      const findArtists = data.body.artists.items;
      console.log("The received data from the API: ", data.body);
      res.render("artist-search-results", { findArtists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  console.log(req.params.artistId);

  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      const findAlbums = data.body.items;
      console.log("The received data from the API: ", data.body);
      res.render("albums", { findAlbums });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.get("/tracks/:trackId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.trackId)
    .then((data) => {
      const findTracks = data.body.items;
      console.log(findTracks);
      res.render("tracks", { findTracks });
    })
    .catch((err) =>
      console.log("The error while searching tracks occurred: ", err)
    );
});
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
