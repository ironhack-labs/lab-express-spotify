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
app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      // console.log(data.body.artists.items);
      res.render("artist-search-results", {
        searchedArtist: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((albums) => {
      // console.log(albums.body);
      res.render("albums", {
        artistAlbums: albums.body.items,
      });
    })
    .catch((error) => console.log("error in albums: ", error));
});

// app.get("/viewtracks/:albumId", (req, res, next) => {
//   spotifyApi
//     .getAlbumTracks(req.params.albumId)
//     .then((tracks) => {
//       console.log(tracks.body.items);
//       res.render("tracks", {
//         artistAlbums: tracks.body.items,
//       });
//     })
//     .catch((error) => console.log("error in albums: ", error));
// });
app.get("/viewtracks/:albumId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((tracks) => {
      console.log(tracks.body.items);
      res.render("tracks", {
        albumTracks: tracks.body.items,
      });
    })
    .catch((error) => console.log("error in albums: ", error));
});

app.get("/", (req, res) => {
  //  to skip layout for a rout: pass layout: false
  res.render("homePage");
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
