require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

// Set up view engine and static files
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Get Spotify access token

// Set up Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
    console.log("Spotify access token received and set");
  })
  .catch((error) => {
    console.log("Error retrieving Spotify access token", error);
  });

// Render index page
app.get("/", (req, res) => {
  res.render("index");
  console.log("OK");
});

app.get("/artist-search", (req, res) => {
  //   console.log('what is this: ', req.query);
  console.log("Search Query:", req.query.theArtistName);

  spotifyApi
    //  |------> Method provided by the SpotifyWebApi npm packages and helps us to search artists whose name contains the search term
    .searchArtists(req.query.theArtistName) // <----- theArtistName is name="theArtistName" in our search form
    .then((data) => {
      console.log(
        "The received data from the API: ",
        data.body.artists.items[0]
      );
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// Start the server
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
