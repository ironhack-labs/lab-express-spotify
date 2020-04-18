require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
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

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  )
  .finally(() => console.log(spotifyApi));

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  let q = req.query.dude;
  spotifyApi
    .searchArtists(q)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists);
      res.render("artist-search-results", { artist: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function (data) {
      console.log("Artist albums", data.body);
      res.render("albums", { albums: data });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/albums/:artistId/tracks/:albumId", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId).then(
    function (data) {
      console.log("tracks", data.body);
      //TODO add res render route and hbs
      res.render("tracks", { tracks: data.body.items });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
