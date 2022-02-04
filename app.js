require("dotenv").config();

const express = require("express");
const req = require("express/lib/request");
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

// ===== create route to home

app.get("/", (req, res, next) => {
  res.render("home");
});

//===== create route to artist-search-result view

app.get("/artist-search", (req, res, next) => {
  const { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      // console.log("The received data from the API: ", data.body);
      const artistItems = data.body.artists.items;
      // console.log(artistItems[1]);
      res.render("artist-search-results", { artist: artistItems });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

//====== create route to album view

app.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const albumData = data.body.items;
      // console.log(albumData);
      res.render("albums", { albums: albumData });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

//====== create route to tracks view

app.get("/albums/:albumId/tracks", (req, res, next) => {
  const { albumId } = req.params;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const tracksData = data.body.items;
      // console.log(tracksData);
      res.render("tracks", { tracks: tracksData });
    })
    .catch((err) =>
      console.log("The error while searching tracks occurred: ", err)
    );
});

app.listen(3007, () =>
  console.log("My Spotify project running on port 3007 🎧 🥁 🎸 🔊")
);
