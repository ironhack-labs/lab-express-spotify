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
  res.render("home");
});

app.get("/artist-search", (req, res) => {
  const { search } = req.query;

  spotifyApi
    .searchArtists(search.toLowerCase())
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      const response = data.body.artists.items;
      return res.render("artist-search", { artist: response });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;

  spotifyApi
    .getArtistAlbums(artistId, { limit: 10, offset: 20 })
    .then((data) => {
      console.log("Album information", data.body);
      const albums = data.body.items;
      return res.render("albums", { album: albums });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/tracks/:albumId", (req, res, next) => {
  const { albumId } = req.params;

  spotifyApi
    .getAlbumTracks(albumId, { limit: 10, offset: 1 })
    .then((data) => {
      console.log("Album information", data.body.items);
      const tracks = data.body.items;
      return res.render("tracks", { track: tracks });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.listen(4000, () =>
  console.log("My Spotify project running on port 4000 🎧 🥁 🎸 🔊")
);
