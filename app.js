require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebAPI = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyAPI = new SpotifyWebAPI({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

//retrieve an access token
spotifyAPI
  .clientCredentialsGrant()
  .then((data) => spotifyAPI.setAccessToken(data.body["access_token"]))
  .catch((error) => console.log("Something went wrong", error));

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

//artist search
app.get("/artist-search", (req, res) => {
  spotifyAPI
    .searchArtists(req.query.theArtistName)
    .then((data) => {
      console.log(data.body.artists.items[0]);
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

//3: artist based on unique iD
app.get("/albums/:artistId", (req, res) => {
  spotifyAPI
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      res.render("albums", { albums: data.body.albums });
    })
    .catch((err) => console.log("The error occurred: ", err));
});

//4: track based on unique iD
app.get("/tracks/:trackId", (req, res) => {
  spotifyAPI
    .getAlbumTracks(req.params.trackId)
    .then((data) => {
      res.render("tracks", { tracks: data.body.items });
    })
    .catch((err) => console.log("Following error occurred: ", err));
});

//start server
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
