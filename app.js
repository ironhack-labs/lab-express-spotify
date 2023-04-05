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
  .catch((error) => console.log("Something went wrong when retrieving an access token", error));

// Our routes go here:
app.get("/test", (req, res) => {
  res.send("Test route working");
});

app.get("/", (req, res) => {
  console.log("Hello");
  res.render("index");
});

app.get("/artist-search", async (req, res) => {
  const artistName = req.query.artist;

  try {
    const data = await spotifyApi.searchArtists(artistName);
    console.log("The received data from the API: ", data.body);

    // Render the search results
    res.render("artist-search-results", { artists: data.body.artists.items });
  } catch (err) {
    console.log("The error while searching artists occurred: ", err);
    res.status(500).send("Error searching artists");
  }
});

app.listen(5000, () => console.log("My Spotify project running on port 5000 🎧 🥁 🎸 🔊"));
