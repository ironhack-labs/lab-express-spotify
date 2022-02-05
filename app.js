require("dotenv").config();

const express = require("express");
const res = require("express/lib/response");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setting the spotify-api goes here:

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

// Our routes go here:

app.get("/", (req, res) => res.render("index"));

app.get("/artist-search", (req, res) => res.render("artist-search"));

app.post("/artist-search", (req, res) => {
  const { artist } = req.body;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      const results = data.body.artists.items;
      res.render("artist-search-results", { results });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/artist-search-results/albums/:id", (req, res, next) => {
  const { id } = req.params;
  spotifyApi
    .getArtistAlbums(id)
    .then((data) => {
      const results = data.body.items;
      res.render("albums", { results });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.get("/artist-search-results/albums/:id/tracks", (req, res, next) => {
  const { id } = req.params;
  spotifyApi
    .getAlbumTracks(id)
    .then((data) => {
      const results = data.body.items;
      res.render("tracks", { results });
    })
    .catch((err) =>
      console.log("The error while searching tracks occurred: ", err)
    );
});

app.listen(3001, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
