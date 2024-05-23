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
app.get("/", (req, res) => res.render("home"));

app.get("/artist-search", (req, res) => {
  const search = req.query.artist;
  spotifyApi
    .searchArtists(search)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      res.render("artist-search-result", { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((data) => {
      res.render("artist-albums", { albums: data.body.items });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/view-tracks/:id", (req, res) => {
    spotifyApi
      .getAlbumTracks(req.params.id, { limit : 15, offset : 1 })
      .then((data) => {
        console.log(data.body.items);
        res.render("album-tracks", { tracks: data.body.items });
      })
      .catch((err) => {
        console.error(err);
      });
  });

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
