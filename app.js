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
  clientSecret: process.env.CLIENT_SECRET
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
  res.render("index");
});

app.get("/artist-search", (request, response) => {
  const term = request.query.term;

  spotifyApi
    .searchArtists(term)
    .then((data) => {
      const artists = data.body.artists.items;
      response.render("artist-search-results", { artists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  const artistId = req.params.artistId;
  let albums;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      albums = data.body.items;
      return spotifyApi.getNewReleases();
    })
    .then((data) => {
      const releases = data.body.albums.items;
      res.render("albums", { albums: albums, releases: releases });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/album/:albumId", (request, response) => {
  // const albumId = request.params.albumId;
  const { albumId } = request.params;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const tracks = data.body.items;
      response.render("album-track", { tracks: tracks });
    })
    .catch((error) => {
      console.log("There was an error loading the album track");
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
