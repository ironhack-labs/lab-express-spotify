require("dotenv").config();

const express = require("express");
const res = require("express/lib/response");
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

app.get("/artist-search", (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.artist)
  .then((data) => {
    console.log(data.body.artists);
    console.log("The received data from the API: ", data.body);
    res.render("artist-search-results", data)
  })
  .catch((err) =>
    console.log("The error while searching artists occurred: ", err)
)});

// Our routes go here:

app.get("/", (req, res, next) => {
  res.render("home");
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
