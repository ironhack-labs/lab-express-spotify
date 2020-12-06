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
    const artist = await spotifyApi.searchArtists(req.query.searchArt);
    const artists = artist.body.artists.items;

    res.render("artist-search-results", { artists });
  } catch (err) {
    console.log(err);
  }
});

app.get("/albums/:artistId", async (req, res) => {
  try {
    const albums = await spotifyApi.getArtistAlbums(req.params.artistId);
    const data = albums.body.items;

    res.render("albums", { data });
  } catch (err) {
    console.log(err);
  }
});

app.get("/tracks/:albumId", async (req, res) => {
  try {
    const trackId = await spotifyApi.getAlbumTracks(req.params.albumId);
    const tracks = trackId.body.items;

    res.render("tracks", { tracks });
  } catch (err) {
    console.log(err);
  }
});

app.listen(3001, () =>
  console.log("My Spotify project running on port 3001 🎧 🥁 🎸 🔊")
);
