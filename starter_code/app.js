require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
// const lru = require("lru-cache");
const port = 3000;
const SpotifyWebApi = require("spotify-web-api-node");

const lru = require("lru-cache");
ejs.cache = new lru(200);

// app.use(express.static(path.join(__dirname, "public")));

// app.set("views", path.join(__dirname, "views"));
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(require("express-ejs-layouts"));




// require spotify-web-api-node package here:

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artists", (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.artistQuery)
  .then(data => {
      res.render("artists", {artists: data.body.artists.items});
      console.log(data.body.artists.items);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then(data =>{
    res.render("albums", {albums: data.body.items})
    console.log(data.body.items[0])
  }).catch(err=>{
    console.log("The error while searching artists occurred: ", err);
  })
});

app.get("/tracks/:albumsId", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumsId).then(data =>{
    res.render("tracks", {tracks: data.body.items})
    console.log(data.body.items[0])
  }).catch(err=>{
    console.log("The error while searching artists occurred: ", err);
  })
});

app.listen(`${port}`, () =>
  console.log(`My Spotify project running on port ${port} 🎧 🥁 🎸 🔊`)
);
