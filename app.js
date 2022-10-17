/*
Client ID 01fa0dc4bf2d4ec096461ee2215872ae
Client Secret d8546bc80ac5480f9819c57751e336c0
*/
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
  res.render("home.hbs");

  app.get("/artist-search", (req, res, next) => {
    const { artistName } = req.query;
    //console.log(artistName);
    spotifyApi
      .searchArtists(artistName)
      .then((data) => {
        //console.log('The received data from the API: ', data.body.artists);
        res.render("artist-search-results.hbs", {
          data: data.body.artists,
        });
        console.log("data:", data.body.artists);
      })
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      );
  });
});

app.get("/albums/tracks/:tracksId", (req, res, next) => {
  const { tracksId } = req.params;
  spotifyApi
    .getAlbumTracks(tracksId)
    .then((response) => {
      res.render("tracks.hbs", {
        tracks: response.body.items,
      });
    })
    .catch((err) => next(err));
});

app.get("/albums/:artistId", (req, res, next) => {
  //console.log("primero", req.params)                    //estos console.log me aparecen dos veces en la terminal con diferente resultado...
  const { artistId } = req.params;
  //console.log("segundo", artistId)
  spotifyApi
    .getArtistAlbums(artistId)
    .then((response) => {
      res.render("albums.hbs", {
        albums: response.body.items,
      });
    })
    .catch((err) => next(err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
