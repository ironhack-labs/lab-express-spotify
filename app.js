require("dotenv").config();

const express = require("express");
const app = express();
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

app.set("view engine", "hbs");
app.set("views", __dirname + "/public/views");
app.use(express.static(__dirname + "/public"));

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) => console.log("Something went wrong when retrieving an access token", error));

// Routes

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => res.render("artists", { artists: data.body.artists.items }))
    .catch((err) => console.log("The error while searching artists occurred: ", err));
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => res.render("albums", { albums: data.body.items }))
    .catch((err) => console.log("The error while searching albums occurred: ", err));
});

app.get("/albums/tracks/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => res.render("tracks", { tracks: data.body.items }))
    .catch((err) => console.log("The error while searching tracks occurred: ", err));
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
