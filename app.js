require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const util = require("util");

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

app.get("/home", (req, res) => res.render("index"));

app.get("/artist-search", (req, res) => {
  console.log(req.query.artist);

  spotifyApi
    .searchArtists(req.query.artist)
    .then((dataFromAPI) => {
      // console.log("The received data from the API: ", myJSON);

      //console.log(dataFromAPI.body.artists);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      //console.log(dataFromAPI
      res.render("artist-search-results", dataFromAPI.body.artists);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((albumsFromAPI) => {
      const albumsData = {
        albums: albumsFromAPI.body.items,
        artist: albumsFromAPI.body.items[0].artists[0].name,
        image: albumsFromAPI.body.items[0].images[0],
      };

      res.render("albums", albumsData);
    })
    .catch((err) =>
      console.log("The error while getting artist albums: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
