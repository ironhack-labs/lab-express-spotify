require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
const path = require("path");

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
// sending info from a form
app.get("/", (req, res) => {
  res.set("Content-Type", "text/html");

  res.render("index", {
    title: "Hello world",
  });
});

// Query String
app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log("The received data from the API:", data.body);
      res.render("artist-search-results", { artists: data.body.artists.items });
      console.log(data.body.artists.items)
    })
    .catch((err) => {
      console.log("The error while searching artists occurred: ", err);
      res.render("error", { err: err });
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  // get the artistId from the request params
  const artistId = req.params.artistId;
  console.log("artistId", artistId)

  // use Spofify Api to get the albums of the specified artist
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      // render the albums.hbs template, passing the albums data
      res.render("albums", { albums: data.body.items });
      console.log(data)
    })
    .catch((error) => {
      // Pass any errors to the error handling middleware
      next(error);
    });
});

app.get("/tracks/:albumId", (req, res, next) => {
  // get the albumId from the request params
  const albumId = req.params.albumId;

  // use Spofify Api to get the tracks of the specified album
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      // render the tracks.hbs template, passing the tracks data
      res.render("tracks", { tracks: data.body.items });
      console.log(data.body.items)
      
    })
    .catch((error) => {
      // Pass any errors to the error handling middleware
      next(error);
    });
});


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
