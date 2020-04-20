require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const path = require("path");

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
app.get("/", function (req, res) {
  res.render("index");
});

app.get("/artist-search", function (req, res) {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log(
        "The received data from the API: ",
        data.body.artists.items
        //path to images - data.body.artists.items[0].images[0].url
      );
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      //object structure: data.body => artists (an object) => items (an array of all the individualartist objects)
      res.render("artist-search-results", { artist: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  // .getArtistAlbums() code goes here
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(function (albums) {
      res.render("albums", albums.body);
    })
    .catch(
      (err) => console.log("The error occurred while loading albums: ", err) //I'm getting an error but the albums are loading. Don't get it.
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
