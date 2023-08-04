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
    const { artist } = req.query;
    searchedArtists = await spotifyApi.searchArtists(artist);
    const artists = searchedArtists.body.artists.items;
    console.log(searchedArtists.body.artists.items)
    res.render("artist-search-results", { artists });
  } catch (error) {
    console.log("Error: ", error);
  }
});

app.get("/albums/:artistId", async (req, res) => {
  try {
    const { artistId } = req.params;
    let artistAlbums = await spotifyApi.getArtistAlbums(artistId);
    let albums = artistAlbums.body.items;
    res.render("albums", { albums });
  } catch (error) {
    console.log("Error: ", error);
  }
});

app.get("/tracks/:albumId", async (req, res) => {
    try {
      const { albumId } = req.params;
      let albumTracks = await spotifyApi.getAlbumTracks(albumId);
      console.log(albumTracks.body.items);
      let tracks = albumTracks.body.items;
      res.render("tracks", { tracks });
    } catch (error) {
      console.log("Error: ", error);
    }
  });

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
