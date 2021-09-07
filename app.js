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
// ** Home page Route **
app.get("/", (req, res) => {
  res.render("home-page");
});
app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist) /*'HERE GOES THE QUERY ARTIST'*/
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search", { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
// 1.- crear albums.hbs con nombre, album y boton.
// 2.- crear app con la siguiente funcion
app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      console.log("Artist albums", data.body);
      res.render("albums", { albums: data.body.artist.albums });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
