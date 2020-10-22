require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const router = express.Router();

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

// define the home page route
app.get("/", function (req, res) {
  res.render("home");
});

app.get("/artist-search", function (req, res) {
  spotifyApi
    .searchArtists(req.query.artistSearch)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", {
        artistInfo: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res, next) => {
  // .getArtistAlbums() code goes here
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((data) => {
      console.log("Artist albums", data.body.items);
      res.render("albums", { albumsInfo: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.get("/tracks/:id", (req, res, next) => {
    spotifyApi
      .getAlbumTracks(req.params.id)
      .then((data) => {
        console.log("Artist albums tracks", data.body.items);
        res.render("tracks", { tracksInfo: data.body.items });
      })
      .catch((err) =>
        console.log("The error while searching tracks occurred: ", err)
      );
  });

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
