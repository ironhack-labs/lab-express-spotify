require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

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

// HOME SCREEN route
app.get("/", function (req, res, next) {
  res.render("index");
});

// SERACH RESULTS route
app.get("/artist-search", function (req, res, next) {
  spotifyApi
    .searchArtists(req.query.searchParam)
    .then((data) => {
      data.body.artists.items.forEach((element) => {
        if (element.images.length === 0)
          element.images.push({
            url: "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2",
          });
      });
      res.render("artist-search-results", {
        artist: data.body.artists.items,
        search: req.query.searchParam,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// ARTIST ALBUMS route
app.get("/albums/:artistId", function (req, res, next) {
  spotifyApi
    .getArtist(req.params.artistId)
    .then((data) => {
      return data.body;
    })
    .then((artist) => {
      spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then((data) => {
          if (artist.images.length === 0)
            artist.images.push({
              url: "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2",
            });
          res.render("album-search-results", {
            albums: data.body.items,
            artist: artist,
          });
        })
        .catch((err) =>
          console.log("The error while searching artists occurred: ", err)
        );
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// ALBUM SONGS route
app.get("/albumSongs/:albumId", function (req, res, next) {
  spotifyApi
    .getAlbum(req.params.albumId)
    .then((data) => {
      console.log(data.body);
      return data.body;
    })
    .then((album) => {
      spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then((data) => {
          res.render("album-songs", {
            songs: data.body.items,
            album: album,
          });
        })
        .catch((err) =>
          console.log("The error while searching artists occurred: ", err)
        );
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
