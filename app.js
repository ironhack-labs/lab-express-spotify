require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebAPI = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebAPI({
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

// setting the spotify-api goes here:

// Our routes go here:
app.get("/", (req, res) => {
  res.render("home-page");
});
app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log("The received data from the API", data.body);
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistID)
    .then((data) => {
      res.render("albums", {
        artist: data.body.items[0].artists[0].name,
        albums: data.body.items,
      });
    })
    .catch((err) => {
      console.log("there was an error", err);
    });
});

app.get("/tracks/:trackId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.artistID)
    .then((data) => {
      res.render("tracks", data.body.items);
    })
    .catch((err) => {
      console.log(err);
    });
});
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
