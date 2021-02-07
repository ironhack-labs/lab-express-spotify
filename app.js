require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  const artistQuery = req.query;
  spotifyApi
    .searchArtists(artistQuery.artist)
    .then((data) => {
      res.render("artist-search-results", data.body.artists);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res, next) => {
  const artistId = req.params.id;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      res.render("albums", data.body);
    })
    .catch((err) => {
      console.log("Error while retrieving albums", err);
    });
});

app.get("/tracks/:id", (req, res, next) => {
  const albumId = req.params.id;
  spotifyApi.getAlbumTracks(albumId, { limit: 25, offset: 0 }).then(
    (data) => {
      res.render("tracks", data.body);
    },
    (err) => {
      console.log("Something went wrong!", err);
    }
  );
});

// Start the server
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
