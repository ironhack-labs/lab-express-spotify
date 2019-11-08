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
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:

app.get("/", (req, res) => {
  res.render("index.hbs");
});

app.get("/artists", (req, res) => {
  let searchData = req.query.q;

  spotifyApi
    .searchArtists(searchData)
    .then(data => {
      console.log("The received data from the API: ", data.body);
      res.render("artists.hbs", { artistList: data.body.artists.items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:id", (req, res) => {
  let searchData = req.params.id;

  spotifyApi
    .getArtistAlbums(searchData)
    .then(data => {
      res.render("albums.hbs", { artist: data.body.items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/tracks/:id", (req, res) => {
  let searchData = req.params.id;

  spotifyApi
    .getAlbumTracks(searchData)
    .then(data => {
      res.render("tracks.hbs", { tracks: data.body.items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
