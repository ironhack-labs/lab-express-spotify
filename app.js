require("dotenv").config();

const express = require("express");
const path = require("path");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
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

app.get("/artist-search", (req, res, next) => {
  const query = req.query.name;
  spotifyApi
    .searchArtists(query)
    .then((data) => {
      const artists = data.body.artists.items;
      console.log(artists);
      res.render("artist-search-results", { artists });
    })
    .catch((err) => console.log(`this is your error: ${err}`));
});

app.get("/albums", (req, res, next) => {
  const artistId = req.query.id;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const albums = data.body.items;
      console.log(albums);
      res.render("albums", { albums });
    })
    .catch((err) => {
      console.log("An error occurred while retrieving artist albums:", err);
    });
});

app.get("/tracks/:albumId", (req, res, next) => {
  const albumId = req.params.albumId;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      console.log(data.body.items);
      const tracks = data.body.items;
      res.render("tracks", { tracks });
    })
    .catch((err) => {
      console.log("An error occurred while retrieving artist albums:", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
