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

app.get(`/`, (req, res) => {
  res.render("index");
});

app.get("/artist-search", async (req, res) => {
  try {
    const { searchTerm } = req.query;
    // console.log('Search Term', searchTerm)
    const filteredArtistsObject = await spotifyApi.searchArtists(searchTerm);
    // res.send(filteredArtistsObject.body.artists);
    // return;
    const { items: foundArtists } = filteredArtistsObject.body.artists;
    // res.json(filteredArtists);
    // res.json(foundArtists);

    res.render("artist-search-result", { artists: foundArtists });
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
});

// app.get('/artist-search-results', async (req, res) => {
//   try {

//   }
// });

app.listen(process.env.PORT, () =>
  console.log(`My Spotify project running on port ${process.env.PORT} 🎧`)
);
