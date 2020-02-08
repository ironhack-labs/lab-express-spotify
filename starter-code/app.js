require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const SpotifyWebAPI = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const app = express();
const PORT = 3000;

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebAPI({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error => console.log("Something went wrong when retrieving an access token", error));

// Our routes go here:
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  const artist = req.query.artist;
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      // console.log("The received data from the API: ", data.body.artists.items);
      let result = data.body.artists.items;
      res.render("artist-search", { result });
    })
    .catch(err => console.log("The error while searching artists occurred: ", err));
});

app.get("/albums/:id", (req, res, next) => {
  const artistID = req.params.id;
  spotifyApi
    .getArtistAlbums(artistID)
    .then(data => {
      console.log("Albums information", data.body);
      let result = data.body.items;
      data.body.items.forEach(element => {
        console.log(element.images[0].url);
      });
      res.render("albums", { albums: result });
    })
    .catch(err => console.log("Error is: --->", err));
});

app.get("/tracks/:albumId", (req, res) => {
  const albumID = req.params.albumId;
  spotifyApi
    .getAlbumTracks(albumID)
    .then(data => {
      // console.log(data.body);
      let result = data.body.items;
      res.render("tracks", { tracks: result });
    })
    .catch(err => console.log("Something went wrong!", err));
});

app.listen(PORT, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
