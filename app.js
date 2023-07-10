require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) => console.log("Something went wrong when retrieving an access token", error));

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
app.get("/", (req, res, next) => {
  spotifyApi
    .searchArtists("madonna")
    .then((data) => {
      // console.log(data.body);
      res.send(data.body.artists.items[0].images);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Our routes go here:

app.get("/homepage", (req, res) => {
  res.render("homepage");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artistName)
    .then((data) => {
      const artistItems = data.body.artists.items;

      res.render("artist-search-results", { artistItems: artistItems });
    })
    .catch((err) => console.log("The error while searching artists occurred: ", err));
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function (data) {
      const artistAlbum = data.body;

      res.render("albums", { artistAlbum: artistAlbum });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:albumId", (req, res) => {
  // console.log("params:", req.params);
  spotifyApi.getAlbumTracks(req.params.albumId, { limit: 5, offset: 1 }).then(
    function (data) {
      console.log(data.body);
      const albumTracks = data.body;
      console.log("items info", albumTracks);
      res.render("tracks", { albumTracks: albumTracks });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
