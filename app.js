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

app.get("/", (req, res) => {
  res.render("index");
});

//Search the artist here

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      res.render("artist-search", {
        searchResult: data.body.artists.items,
        image: data.body.artists.items[1].images,
        id: data.body.artists.items.id,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

//Display selected artist's album

app.get("/albums/:id", (req, res) => {
  let id = req.params.id;

  spotifyApi
    .getArtistAlbums(id)
    .then((data) => {
      res.render("albums", {
        albums: data.body.items,
        image: data.body.items[1].images,
      });
    })
    .catch((err) =>
      console.log("The error while displaying albums occurred: ", err)
    );
});

//Display tracks

app.get("/tracks/:id", (req, res) => {
  let id = req.params.id;
  spotifyApi
    .getAlbumTracks(id)
    .then((data) => {
      res.render("tracks", {
        tracks: data.body.items,
      });
    })
    .catch((err) =>
      console.log("The error while displaying albums occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
