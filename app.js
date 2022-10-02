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
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res, next) => {
  console.log("homepage");
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  const { artistName } = req.query;
  return spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      const { items } = data.body.artists;
      res.render("artist-search-result", { itemsArr: items, artistName });
    })
    .catch((err) => {
      console.log("we've got an error here...", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  const albumsListId = req.params.artistId;
  return spotifyApi
    .getArtistAlbums(albumsListId)
    .then((data) => {
      const { items } = data.body;
      const artistName = data.body.items[0].artists[0].name;
      res.render("albums", { itemsArr: items, artistName });
    })
    .catch((err) => {
      console.log("we've got an error here...", err);
    });
});

app.get("/tracks/:albumId", (req, res, next) => {
  const albumTracksId = req.params.albumId;
  return spotifyApi
    .getAlbumTracks(albumTracksId)
    .then((data) => {
      console.log(data.body.items[0]);
      const {items} = data.body
      const artistName = data.body.items[0].artists[0].name;
      res.render('tracks', {itemsArr: items, artistName})
    })
    .catch((err) => {
      console.log("we've got an error here...", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
