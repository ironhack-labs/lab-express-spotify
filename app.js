require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) => console.log("Something went wrong when retrieving an access token", error));

// Our routes go here:

app.get("/", async (req, res) => {
  res.render("searchArtist");
});

app.get("/artist-search", async (req, res) => {
  try {
    const { title } = req.query;
    let results = await spotifyApi.searchArtists(title);
    console.log(results.body.artists);
    res.render("artist-search-results", results.body.artists);
  } catch (error) {}
});

app.get("/albums/:artistId", async (req, res) => {
  try {
    const { artistId } = req.params;
    let results = await spotifyApi.getArtistAlbums(artistId);

    res.render("albums", results.body);
  } catch (error) {}
});

app.get("/tracks/:albumId", async (req, res) => {
  try {
    const { albumId } = req.params;
    let results = await spotifyApi.getAlbumTracks(albumId);

    res.render("tracks", results.body);
  } catch (error) {}
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
