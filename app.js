require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

hbs.registerPartials(__dirname + "/views/partials"); // config partials

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
// Our routes go home.hbs:
app.get("/", (req, res, next) => {
  console.log("this is the homepage");
  // res.send("hello world");
  res.render("home");
});

// Our routes go artist-search-results.hbs:
app.get("/artist-search", (req, res, next) => {
  const titleOfTheArtist = req.query.artist;
  spotifyApi
    .searchArtists(titleOfTheArtist)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const { items: artistDetails } = data.body.artists;
      res.render("artist-search-results", artistDetails);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// Our routes go albums.hbs:
app.get("/albums/:artistId", (req, res, next) => {
  const idOfArtist = req.params.artistId;
  spotifyApi.getArtistAlbums(idOfArtist).then(
    function (data) {
      console.log("Artist albums", data.body);
      const { items: albumDetails } = data.body;
      res.render("albums", albumDetails);
    },
    function (err) {
      console.error(err);
    }
  );
});

// Our routes go tracks.hbs:
app.get("/tracks/:tracksId", (req, res, next) => {
  const idOfTracks = req.params.tracksId;

  spotifyApi.getAlbumTracks(idOfTracks).then(
    function (data) {
      console.log("Tracks", data.body);
      const { items: trackDetails } = data.body;
      res.render("tracks", trackDetails);
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
