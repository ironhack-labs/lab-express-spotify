require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// set spotifyApi
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) => console.log("Something went wrong when retrieving an access token", error));

//All routes:

app.get("/", (req, res) => {
  res.render("index", { docTitle: "Music App! " });
});

app.get("/artist-search", async (req, res) => {
  try {
    const data = await spotifyApi.searchArtists(req.query.name);

    // console.dir(data, { depth: null });

    res.render("search", {
      docTitle: "Artist Results",
      data: data.body.artists.items,
    });
  } catch (error) {
    console.log("The error while searching artists occurred: ", error);
  }
});

app.get("/albums", async (req, res) => {
  try {
    const data = await spotifyApi.getArtistAlbums(req.query.id);
    console.dir(data, { depth: null });
    res.render("searchResults", {
      docTitle: "Albums",
      data: data.body.items,
    });
  } catch (error) {
    console.log("The error while searching albums occurred: ", error);
  }
});

app.get("/tracks", async (req, res) => {
  try {
    const data = await spotifyApi.getAlbumTracks(req.query.id);
    console.dir(data, { depth: null });
    res.render("albumtracks", {
      docTitle: "Tracks",
      data: data.body.items,
    });
  } catch (error) {
    console.log("The error while searching albums occurred: ", error);
  }
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
