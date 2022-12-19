require("dotenv").config();
const express = require("express");
const hbs = require("hbs");

// setting the spotify-api goes here:

const SpotifyWebApi = require("spotify-web-api-node");

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

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Our routes go here:

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.name)
    .then((result) => {
      console.log(
        "Received search results: ",
        result.body.artists.items[0].images
      );

      const artistsData = result.body.artists.items;

      res.render("artist-search-results", {
        artistsData,
        query: req.query.name,
      });
    })
    .catch((err) =>
      console.log("An error occured while searching for artists: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
