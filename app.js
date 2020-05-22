require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

//STATIC & PARTIALS
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((e) =>
    console.log("Something went wrong when retrieving an access token", e)
  );
// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      res.render("artistSearch", { artist: data.body.artists.items });
    })
    .catch((e) => console.log("Error when searching artist was occurred: ", e));
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId, { limit: 10, offset: 20 })
    .then((data) => {
      console.log("Album query: ", data.body.items[0]);
      res.render("albums", { albums: data.body.items });
    })
    .catch((e) => console.log("Error when show Albums was occurred:", e));
});

app.get("/tracks/:tracksId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.tracksId)
    .then((data) => {
      console.log("Data query:", data.body);
      res.render("tracks", { tracks: data.body });
    })
    .catch((e) => console.log("Error when show Tracks was occurred:", e));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
