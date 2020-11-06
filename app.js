const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();
require("dotenv").config();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi.clientCredentialsGrant().then((data) => {
  spotifyApi.setAccessToken(data.body["access_token"]);
});

app.get("/artist-search", (req, res) => {
  spotifyApi.searchArtists(req.query.artistSearch).then((data) => {
    const artists = data.body.artists.items;
    res.render("artist-search-results", { artists });
  });
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then((data) => {
    const albums = data.body.items;
    res.render("albums", { albums });
  });
});

app.get("/tracks/:albumId", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId).then((data) => {
    const tracks = data.body.items;
    res.render("tracks", { tracks });
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
