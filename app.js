require("dotenv").config();

const { query } = require("express");
const express = require("express");
const hbs = require("hbs");
const logger = require("morgan");

// require spotify-web-api-node package here:

const app = express();

app.use(logger("dev"));
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
const SpotifyWebApi = require("spotify-web-api-node");

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
  res.render("home");
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    /* .then((res) => {
  console.log(res) */
    .then((data) => {
      res.render("artists", {
        artists: data.body.artists.items,
        query: req.query.artist,
      });
    })
    .catch((e) => next(e));
});

app.get("/albums/:id", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((data) =>
      res.render("albums", {
        albums: data.body.items,
        query: data.body.items[0].artists[0].name,
      })
    )
    .catch((e) => next(e));
});

app.get("/tracks/:id", (req,res,next) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then((data)=>
    res.render("tracks", {
      tracks: data.body.items,
      query: data.body.items[0].artists[0].name,
    }))
    .catch((e) => next(e));
    
})

// MIDDLEWARE --> Error =====================================================================

app.use((error, req, res, next) => {
  res.render("error", { error });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
