require("dotenv").config();

const { response, query } = require("express");
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
//Home Page
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artistName)
    .then((data) => {
      console.log(data.body.artists.items);
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) => console.log("this is an error in artists=>  ", err));
});

//Albums
app.get("/albums/:artistId", (req, res,next) => {
  //console.log(req.params)
   spotifyApi.getArtistAlbums(req.params.artistId)
      .then((data) => {
        console.log(data.body.items)
      res.render("albums", { albums: data.body.items });
         })
    .catch((err) => console.log("this is an error in albums=>  ", err));
});

//Tracks
app.get("/tracks/:tracksId", (req, res,next) => {
  spotifyApi.getAlbumTracks(req.params.tracksId)
     .then((data) => {
      res.render("tracks", { tracks: data.body.items });
    })
    .catch((err) => console.log("this is an error in tracks =>  ", err));
});

app.listen(4000, () =>
  console.log("My Spotify project running on port 4000 🎧 🥁 🎸 🔊")
);
