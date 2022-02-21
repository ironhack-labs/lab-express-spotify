require("dotenv").config();

const express = require("express");
const { get } = require("express/lib/response");
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

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res, next) => res.render("index"));

// Search for artist
app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artistName)
    .then((data) => {
      res.render("artist-search-results", { artist: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// View albums of specific artist
app.get("/:artist/albums/:artistId", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then((data) => {
    const albums = {
      albumArr: data.body.items,
      artist: data.body.items[0].artists[0].name,
    };
    res.render("albums", { albums });
  });
});

// View tracks of specific album
app.get("/:album/tracks/:albumId", (req, res, next) => {
  spotifyApi.getAlbum(req.params.albumId).then((data) => {
    const tracks = {
      trackArr: data.body.tracks.items,
      albumName: data.body.name,
    }
    res.render("tracks", {tracks: tracks});
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
