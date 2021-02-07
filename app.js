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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.get("/");

app.get("/", (req, res) => {
  res.status(200).render("index");
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.search)
    .then((data) => {
      console.log("recieved data", data.body.artists);
      res.render("artist-search-results", data.body.artists);
    })
    .catch((err) => console.log(err));
});

app.get("/albums/:id", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((data) => {
      const albums = data.body;
      res.render("albums", albums);
    })
    .catch((err) => console.log(err));
});

app.get("/tracks/:albumId", (req, res, next) => {
  const { albumId } = req.params;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const tracks = data.body;
      console.log("Tracks", tracks);
      res.render("tracks", tracks);
    })
    .catch((err) => console.log(err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
