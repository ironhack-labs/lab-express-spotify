require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const async = require("hbs/lib/async");

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
  res.render("index");
});

app.get("/artist-search", async (req, res) => {
  try {
    const artistId = req.query.artistId;
    const data = await spotifyApi.searchArtists(artistId);
    const artistSearched = data.body.artists.items;
    res.render("artist-search-results", { artistSearched });
  } catch (error) {
    console.log(error);
  }
});

app.get("/albums/:artistId", async (req, res) => {
  try {
    const id = req.params;
    const data = await getArtistAlbums(id);
    const albums = data.body.items;
    res.render("albums", { albums });
  } catch (error) {
    console.log(error);
  }
});

app.get("/tracks/:tracksId", async (req, res) => {
  try {
    const id = req.params.tracksId;
    const data = await getAlbumTracks(id);
    const tracks = data.body.items;
    res.render("tracks", { tracks });
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
