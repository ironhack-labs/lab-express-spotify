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
app.get("/", (req, res) => {
  res.render("home-page");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artistName)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      // the following console displays an artist object, just to show that we can use its keys id, images[0] (just to get the first one) and name to pass the info to the next page
      console.log(
        "The first object in the items array: ",
        data.body.artists.items[0]
      );
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results"); // pass data to the hbs file
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
