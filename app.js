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
app.get("/", function (req, res, next) {
  res.render("homepage", {});
});

app.get("/artist-search", function (req, res, next) {
  // 1. faire un call a l'api spotify pour recup les artistes trouves
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      // 2. faire le rendu de la page de artist-search, presentant les resultats la recherche
      res.render("artist-search", {
        artists: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  // .getArtistAlbums() code goes here
  // 1. faire un call a l'api spotify pour recup les artistes trouves
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function (data) {
      console.log("Artist albums", data.body.items);
      // 2. faire le rendu de la page de albums, presentant les resultats del'artiste choisi
      res.render("albums", {
        albums: data.body.items,
      });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:albumId", (req, res, next) => {
  // .getAlbumTracks() code goes here
  // 1. faire un call a l'api spotify pour recup les artistes trouves
  spotifyApi.getAlbumTracks(req.params.albumId, { limit: 5, offset: 1 }).then(
    function (data) {
      console.log(data.body.items);
      // 2. faire le rendu de la page de albums, presentant les resultats del'artiste choisi
      res.render("tracks", {
        tracks: data.body.items,
      });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
