require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Error retrieving Spotify access token", error)
  );

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const { artist } = req.query;

  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      const items = data.body.artists.items;

      console.log(JSON.stringify(items, null, 2));

      res.render("artist-search-results", { items });
    })
    .catch((error) => console.log("Error by searching artist", error));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
