require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
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
app.get("/home", (req, res, next) => {
  res.render("home");
});
app.get("/artist-search", (req, res, next) => {
  const { query } = req.query;
  spotifyApi
    .searchArtists(query)
    .then((data) => {
      console.log(
        "The received data from the API --->> ",
        data.body.artists.items[0]
      );
      res.render("artist-search", { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res, next) => {
  const { id } = req.params;
  spotifyApi
    .getArtistAlbums(id)
    .then((data) => {
      console.log("/// Album information-->>> ///", data.body.items[0]);
      res.render("albums", { albums: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.get("/tracks/:id", (req, res, next) => {
  const { id } = req.params;
  spotifyApi
    .getAlbumTracks(id)
    .then((data) => {
      console.log("//Track info -->>//", data.body.items);
      res.render("tracks", {tracks : data.body.items})
    })
    .catch((err) =>
      console.log("The error while searching tracks occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
