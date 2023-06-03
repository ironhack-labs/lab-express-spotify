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

app.get("/", (req, res, next) => {
  res.render("home-page");
});

app.get("/:filterName", (req, res, next) => {
  //const artistName = req.query.text
  spotifyApi
    .searchArtists(req.query.text)
    .then((data) => {
      const artists = data.body.artists.items;
      res.render("artist-search-results", { artists });
    })

    .catch((err) => {
      console.log("Error searching the artist... ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      const albums = data.body.items;
      res.render("albums", { albums });
    })
    .catch((err) => {
      console.log("Error getting the albums... ", err);
    });
});

app.get("/view-tracks/:tracksId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.tracksId)
    .then((data) => {
      const tracks = data.body.items;
      console.log(tracks);
      res.render("view-tracks", { tracks });
    })
    .catch((err) => {
      console.log("Error getting tracks... ", err);
    });
});






app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
