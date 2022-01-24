require("dotenv").config();

const express = require("express");
const res = require("express/lib/response");
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

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
//Homepage
app.get("/", (req, res, next) => {
  res.render("home");
});

//Artist searched
app.get("/artist-search-results", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      let searchedArtists = data.body.artists.items;
      res.render("artist-search-results", { searchedArtists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

//Albums
app.get("/albums/:id", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((albums) => {
      let artistAlbums = albums.body.items;
      res.render("albums", { artistAlbums });
    })
    .catch((err) => {
      console.log("Some problem while getting the albums", err);
    });
});

//Tracks
app.get("/view-tracks/:id", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.id, { limit: 5, offset: 1 })
    .then((tracks) => {
      let albumTracks = tracks.body.items;
      console.log(albumTracks);
      res.render("view-tracks", { albumTracks });
    })
    .catch((err) => {
      console.log("Problem with the tracks:", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
