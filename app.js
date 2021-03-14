require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// Require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Setting the spotify-api goes here:
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
// Home page
app.get("/", (req, res) => {
  res.render("home");
  console.log("Home page is visible!");
});

// Artist search results page
app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      const arrayOfArtists = data.body.artists.items;
      res.render("artist-search-results", { artists: arrayOfArtists });
      console.log("Nice! We received the results of the search for an artist!");
    })
    .catch((err) => {
      console.log("Houston, we have a problem...", err);
    });
});

// Artist's albums page
app.get("/albums/:artistId", (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const arrayOfAlbums = data.body.items;
      res.render("albums", { albums: arrayOfAlbums });
      console.log("Yay! Successfully accesssed the albums of an artist!");
    })
    .catch((err) => {
      console.log("We have an error!", err);
    });
});

// Album's tracks page
app.get("/:albumId", (req, res) => {
  const albumId = req.params.albumId;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const tracks = data.body.items;
      res.render("tracks", { tracks: tracks });
      console.log("Wohooo! We accessed the track of the album!", tracks);
    })
    .catch((err) => {
      console.log("Error occured when accessing tracks", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
