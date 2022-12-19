require("dotenv").config();
const express = require("express");
const hbs = require("hbs");

// setting the spotify-api goes here:

const SpotifyWebApi = require("spotify-web-api-node");

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
  try {
    const artistsSearchResponse = await spotifyApi.searchArtists(
      req.query.name
    );

    const artistsData = artistsSearchResponse.body.artists.items;

    res.render("artist-search-results", {
      artistsData,
      query: req.query.name,
    });
  } catch (err) {
    console.log("Something went wrong while searching for artists: ", err);
  }
});

app.get("/albums/:artistId", async (req, res) => {
  try {
    const artistSearchResponse = await spotifyApi.getArtist(
      req.params.artistId
    );

    const { name: artistName, id: artistId } = artistSearchResponse.body;

    const albumsSearchResponse = await spotifyApi.getArtistAlbums(artistId);

    const path = "/tracks/";

    const btnText = "tracks";

    const albumsData = albumsSearchResponse.body.items;

    res.render("albums", {
      albumsData,
      artistName,
      path,
      btnText,
    });
  } catch (err) {
    console.log("Something went wrong while getting artist albums: ", err);
  }
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
