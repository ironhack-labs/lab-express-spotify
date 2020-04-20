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
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/artist-search/", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      res.render("artist-search-results", {
        artistsQuery: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums", (req, res) => {
  spotifyApi.getArtistAlbums(req.query.id).then(
    function (data) {
      //   console.log("Artist albums", data.body.items[0]);
      res.render("albums", { albumsQuery: data.body.items });
    },
    function (err) {
      console.error(err);
    }
  );
});
app.get("/tracks/:trackid", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.trackid).then(
    function (data) {
      console.log(data.body.items);
      res.render("tracks", { tracksQuery: data.body.items });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
