require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

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
// setting the spotify-api goes here:
app.get("/", (req, res) => {
  console.log("GET REQUEST, THIS IS THE HOME PAGE");
  res.render("index");
});
app.get("/artist-search", (req, res) => {
  console.log(req.query);
  const artistSearch = req.query;

  spotifyApi
    .searchArtists(artistSearch.artist)
    .then((data) => {
      //console.log(data.body.artists.items);
      res.render("artist-search-result", data.body);
    })
    .catch((err) => {
      console.log("The error while searching artists occurred: ", err);
      res.redirect("/");
    });
});
app.get("/albums/:artistId", (req, res) => {
  const albumSearch = req.params;
  console.log("line 51", req.params);
  spotifyApi
    .getArtistAlbums(albumSearch.artistId)
    .then((data) => {
      //console.log(data.body.items);
      res.render("albums", data.body);
    })
    .catch((err) => {
      console.log("The error while searching artists occurred: ", err);
      res.redirect("/");
    });
});
app.get("/tracks/:albumId", (req, res) => {
  const albumId = req.params.albumId;
  console.log(req.params);
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      console.log(data.body.items);
      res.render("viewTracks", data.body);
    })
    .catch((err) => {
      console.log("The error while searching artists occurred: ", err);
      res.redirect("/");
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
