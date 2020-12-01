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

app.get("/home", (req, res) => {
  return res.render("home");
});

app.get("/artist-search", (req, res) => {
  const { search } = req.query;
  spotifyApi
    .searchArtists(search)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      const artists = data.body.artists.items;
      return res.render("artist-search-results", { data: artists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res, next) => {
  // .getArtistAlbums() code goes here
  const { id } = req.params;
  spotifyApi
    .getArtistAlbums(id)
    .then((data) => {
      const albums = data.body.items;
      console.log("The received data from the API: ", { albums });
      return res.render("albums", { data: albums });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/tracks/:id", (req, res, next) => {
  // .getArtistAlbums() code goes here
  const { id } = req.params;
  spotifyApi
    .getAlbumTracks(id)
    .then((data) => {
      const tracks = data.body.items;
      console.log("The received data from the API: ", { tracks });
      return res.render("tracks", { data: tracks });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
