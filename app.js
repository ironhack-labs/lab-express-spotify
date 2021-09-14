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

app.get("/", (req, res) => {
  console.log("hello");
  res.render("home-page");
});

app.get("/artist-search", (req, res) => {
  console.log("here");
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log(
        "The received data from the API: ",
        data.body.artists.items[0]
      );
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search", { artist: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:albumId", (req, res, next) => {
  console.log("get albums");
  spotifyApi
    .getArtistAlbums(req.params.albumId)
    .then((data) => {
      console.log("Artist Albums: ", data.body.items[0]);
      res.render("albums", { artistAlbums: data.body.items });
    })
    .catch((err) => {
      console.log("The error while searching artists occurred: ", err);
      next(error);
    });
});

app.get("/track-information/:albumId", (req, res, next) => {
  console.log("get tracks");
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      console.log("Albums tracks: ", data.body);
      res.render("track-information", { tracksAlbums: data.body.items });
    })
    .catch((err) => {
      console.log("The error while searching artists occurred: ", err);
      next(error);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
