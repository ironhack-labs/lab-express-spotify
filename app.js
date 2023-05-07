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
  res.render("home");
});

app.get("/artist-search", async (req, res) => {
  try {
    let data = await spotifyApi.searchArtists(req.query.artist);

    console.log(
      "The received data from the API: ",
      data.body.artists.items[0].images
    );

    res.render("artist-search-results", { results: data.body.artists.items });
  } catch (error) {
    console.log("The error while searching artists occurred: ", err);
  }
});

app.get("/albums/:artistId", async (req, res, next) => {
  try {
    let albums = await spotifyApi.getArtistAlbums(req.params.artistId);

    console.log("Artist albums: ", albums.body.items);

    //res.render("albums", { results: albums.body.items });
    res.send({ results: albums.body.items });

  } catch (error) {
    console.log("The error while searching albums occurred: ", err);
  }
});

app.get("/album-tracks/:albumId", async (req, res) => {
  try {
    let albumTracks = await spotifyApi.getAlbumTracks(req.params.albumId);

    console.log("Album tracks: ", albumTracks.body.items);

    res.render("album-tracks", { results: albumTracks.body.items });

  } catch (err) {
    console.error("The error while searching album tracks occurred: ", err);
  }
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
