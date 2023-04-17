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

// GET home page
app.get("/", (req, res, next) => {
  console.log("Accessing the page visits in the route: ", req.pageVisits);
  res.render("index");
});

// Our routes go here:
app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query["artist-name"])
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      res.render("artist-search-results", {
        artistList: data.body.artists.items,
      });
      console.log(req);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  let artistId = req.params.artistId;
  spotifyApi.getArtistAlbums(artistId).then((data) => {
    let artistList = data.body.items;
    res.render("albums", { artistList });
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
