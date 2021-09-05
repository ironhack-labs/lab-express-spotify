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

// Retrieve an access token (nombre de un elemento)
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
//home-page
app.get("/", (req, res) => {
  res.render("home-page"); //index
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist) //method
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

//iteration4
// create albums.hbs con combre, album y boton.
// create app con la siguiente function...

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(artistId)
    .then(function (data) {
      console.log("Show some ArtistId", data.body.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artistId", { albums: data.body.albums.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
}); //code not working!!!!!!!!!!!!!!!!!!!!

//iteration5

app.get("/track/:albumId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(albumId)
    .then(function (data) {
      console.log("Show some albumId", data.body.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("albumId", {});
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
