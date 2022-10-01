require("dotenv").config();

const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const hbs = require("hbs");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.get("/", (req, res, next) => {
  const data = {
    layout: false,
  };
  res.render("index", data);
});

app.get("/artist-search", (req, res) => {
  const artist = req.query.artist;
  spotifyApi
    .searchArtists(artist)
    .then((response) => {
      const artists = response.body.artists;
      const data = {
        artists: response.body.artists.items,
      };
      res.render("artist-search-results", artists);
    })
    .catch((err) => console.log("Some error in search", err));
});

app.get("/albums/:artistId", (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((response) => {
      const data = {
        albums: response.body.items,
      };
      res.render("albums", data);
    })
    .catch((err) => console.log("Some error in search", err));
});

app.get("/tracks/:albumId", (req, res) => {
  const albumId = req.params.albumId;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((response) => {
      const data = {
        tracks: response.body.items,
      };
      res.render("tracks", data);
    })
    .catch((err) => console.log("Some error in search", err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
