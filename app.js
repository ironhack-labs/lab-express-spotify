require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

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
  res.render("index");
});

app.get("/albums/:artistId", (req, res, next) => {
  // .getArtistAlbums() code goes here
  // console.log("id", req.params.artistId);
  spotifyApi
    .getArtistAlbums(req.params.artistId, {
      limit: 5,
      offset: 1,
    })
    .then(
      function (data) {
        console.log("Artist albums", data.body.items);
        res.render("albums", {
          albumsArr: data.body.items,
        });
      },
      function (err) {
        console.error(err);
      }
    );
});

app.get("/:albumId/tracks", (req, res, next) => {
  // .getAlbumTracks()
  // console.log("This is a test albumID", req.params.albumId);
  spotifyApi
    .getAlbumTracks(req.params.albumId, {
      limit: 5,
      offset: 1,
    })
    .then(
      function (data) {
        console.log("This is the album object", data.body.items);
        res.render("tracks", { tracksArr: data.body.items });
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
});

app.get("/artist-search", (req, res) => {
  // console.log("This is a test", req.query.artist);
  spotifyApi
    .searchArtists(req.query.search)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists);
      res.render("artist-search-results", {
        artistsArr: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
