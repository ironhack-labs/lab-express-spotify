require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public")); // make file in folder "public" available for express

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
/* basic route syntax:
    app.METHOD(PATH, HANDLER) or more specific
    app.get('/', function (req, res) {
    #CODE# -> e.g. console.log("Hello!");
    });
*/

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log(
        "The received search term data from the API: ",
        data.body.artists.items
      );
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((error) =>
      console.log("The error while searching artists occurred: ", error)
    );
});

app.get("/albums", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.query.id)
    .then((data) => {
      console.log("The received artist data from the API: ", data.body);
      res.render("albums", {
        albums: data.body.items,
      });
    })
    .catch((error) =>
      console.log("The error while searching albums occurred: ", error)
    );
});

app.get("/tracks", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.query.id)
    .then((data) => {
      res.render("tracks", { tracks: data.body.items });
    })
    .catch((error) =>
      console.log("The error while searching tracks occurred: ", error)
    );
});

//
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
