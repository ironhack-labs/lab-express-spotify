require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
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
  res.render("index", { title: "Home Page" });
});
app.get("/artist-search", (req, res) => {
  const queryString = req.query.artistName;
  console.log(queryString);

  spotifyApi
    .searchArtists(queryString)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      const artistName = req.query.artistName;
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res) => {
  const { id } = req.params;
  spotifyApi.getArtistAlbums(id).then((data) => {
    console.log("The received data from the API: ", data.body.items);
    res.render("albums", { albums: data.body.items });
  });
});

app.get("/tracks/:id", (req, res) => {
  const { id } = req.params;
  spotifyApi.getAlbumTracks(id).then((data) => {
    console.log("The received data from the API: ", data.body.items);
    res.render("tracks", { tracks: data.body.items });
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
