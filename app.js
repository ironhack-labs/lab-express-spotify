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

//Interation 2
app.get("/", (req, res) => {
  res.render("home");
});

// Interation 3

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist_name)
    .then((data) => {
      // console.log("The received data from the API: ", data.body.artists.items);
      let allArtists = data.body.artists.items;
      res.render("artist-search-results", { allArtists });
    })
    .catch((err) => console.log("The error while searching artists occurred: ", err));
});

// Interation 4

app.get("/albums/:id", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((data) => {
      // console.log("The received data from the API: ", data.body.items);
      let artistAlbums = data.body.items;
      res.render("albums", { artistAlbums });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Interation 5

app.get("/tracks/:id", (req, res) => {
  let { id } = req.params;
  spotifyApi
    .getAlbumTracks(id)
    .then((data) => {
      // console.log("The received data from the API: ", data.body.items[0]);
      res.render("album-tracks", { result: data.body });
    })
    .catch((err) => console.log("The error while searching artists occurred: ", err));
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
