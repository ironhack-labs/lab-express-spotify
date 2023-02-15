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

app.get("/", async (req, res) => {
  try {
    res.render("artist-search");
    // console.log(Home);
  } catch (error) {
    console.log(error);
  }
});
app.get("/artist-search", async (req, res) => {
  try {
    console.log(req.query.artist);
    spotifyApi
      .searchArtists(req.query.artist)
      .then((data) => {
        console.log(
          "The received data from the API: ",
          data.body.artists.items[0]
        );
        // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render("artist-search-results", {
          artists: data.body.artists.items,
        });
      })
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      );
  } catch (error) {
    console.log(error);
  }
});

app.get("/albums:artistId", async (req, res) => {
  try {
    console.log(req.query);
    spotifyApi
      .getArtistAlbums(req.query)
      .then((data) => {
        console.log("The received data from the API: ", data.body);
        // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render("albums", {
          albums: data.body,
        });
      })
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      );
  } catch (error) {
    console.log(error);
  }
});

app.listen(3001, () =>
  console.log("My Spotify project running on port 3001 🎧 🥁 🎸 🔊")
);
