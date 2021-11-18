require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:
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

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Our routes go here:
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", async (req, res) => {
  const artistFromForm = req.query.artist;
  try {
    const artistFromData = await spotifyApi.searchArtists(artistFromForm);
    res.render("artistSearch", { artist: artistFromData.body.artists.items });
  } catch (err) {
    console.log("The error while searching artists occurred: ", err);
  }
});

app.get("/albums/:Id", async (req, res) => {
  const albumFromForm = req.params.Id;

  try {
    const artistAlbum = await spotifyApi.getArtistAlbums(albumFromForm);

    res.render("albums", { album: artistAlbum.body.items });
  } catch {
    console.log("The error while searching almbum occurred: ", err);
  }
});

app.get("/tracks/:Id", async (req, res) => {
  const tracksFromForm = req.params.Id;
  try {
    const artistTracks = await spotifyApi.getAlbumTracks(tracksFromForm);
    console.log(artistTracks.body.items);
    res.render("tracks", { track: artistTracks.body.items });
  } catch {
    console.log("The error while searching tracks occurred: ", err);
  }
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
