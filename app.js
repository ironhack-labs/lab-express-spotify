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

// Our routes go here:

// Step 3: Create /artist-search Route
app.get("/artist-search", (req, res) => {
  const { artistName } = req.query;

  // Check if the artistName is provided
  if (!artistName) {
    return res.render("error", { message: "Please provide an artist name." });
  }

  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      const artists = data.body.artists.items;
      res.render("artist-search-results", { artists });
    })
    .catch((err) => {
      console.log("The error while searching artists occurred: ", err);
      res.render("error", { message: "Error searching for artists." });
    });
});

// // Step 1: Create a Homepage Route
app.get("/", (req, res) => {
  res.render("homepage"); // Assuming you have an 'index' view file (e.g., index.hbs)
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
