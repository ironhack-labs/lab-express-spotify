require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

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

// GET /
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  console.log(req.query);

  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      res.render("artist-search-results", data.body);
      console.log("The received data from the API: ", data.body);
    })
    .catch((err) =>
      console.log("This error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {

  console.log(req.query);
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("albums", data.body);
      console.log("The received data from the API: ", data.body);
  })
    .catch((err) => {
      console.log("The error while getting artist albums occurred: ", err);
      next(err);
      res.send("Search Error" + err);
    });
});


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
