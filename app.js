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

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", async (req, res) => {
  try {
    const artist = req.query.search;
    const obtainedArtists = await spotifyApi.searchArtists(artist);
    const artistsList = obtainedArtists.body.artists.items;
    res.render("artist-search-results", { artistsList });
  } catch (err) {
    console.log("err", err);
  }
});

app.get("/albums/:artistId", async (req, res,next) => {
  try {
    const artist = await spotifyApi.getArtist(req.params.artistId);
    const artistName = artist.body.name;
    const obtainedAlbums = await spotifyApi.getArtistAlbums(req.params.artistId);
    const albumsList = obtainedAlbums.body.items;
    res.render("albums",{albumsList, artistName:artistName});
  } catch (err) {
    console.log("err", err);
  }
});


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
