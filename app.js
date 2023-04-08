require("dotenv").config();

const express = require("express");
const path = require("path");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

hbs.registerPartials(path.join(__dirname, "views", "partials"));

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
  res.render("home");
});

app.get("/artist-search", (req, res, next) => {
  console.log("You are at the artist search page");
  spotifyApi
    .searchArtists(req.query.artists)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      const artists = data.body.artists.items;
      console.log(artists[0]);
      res.render("artist-search", { artists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:name/:id", (req, res, next) => {
  const { name } = req.params;
  const { id } = req.params;
  spotifyApi
    .getArtistAlbums(id)
    .then((data) => {
      const albums = data.body.items;
      res.render("albums", { name, albums });
      console.log(albums);
    })
    .catch((err) => console.error(err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
