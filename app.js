require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const path = require("path");

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

app.get("/", (req, res) => {
  res.render(path.join(__dirname, "views/searchbar.hbs"));
});

app.get("/artist-search", (req, res) => {
  //res.send();
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      let pizza = data.body.artists;
      console.log("The received data from the API: ", pizza);
      res.render(
        path.join(__dirname, "views/artist-search-results.hbs"),
        pizza
      );
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      console.log("Artist albums", data.body);
      res.render(path.join(__dirname, "views/albums.hbs"), data.body);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      console.log("Album Tracks", data.body);
      res.render(path.join(__dirname, "views/tracks.hbs"), data.body);
    })
    .catch((err) =>
      console.log("The error while searching album tracks occurred: ", err)
    );
});

// Our routes go here:
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
