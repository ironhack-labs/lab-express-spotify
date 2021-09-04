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
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

app.get("/", (req, res) => {
  //   console.log(req.params);
  res.render("home-page");
});

app.get("/artist-search", (req, res) => {
  console.log("Artist", req.query.artist);

  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      data.body.artists.items.forEach((element) => {
        console.log(element);
      });
      res.render("artist-search-results", {
        artist: req.query.artist,
        artistList: data.body.artists.items,
      });
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  // .getArtistAlbums() code goes here
  console.log("VIEWING ALBUMs");
  console.log(req.params);
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function (data) {
      console.log("TIENE ALBUMBS");
      console.log("Artist albums", data.body);
      res.render("albums", {
        albums: data.body,
      });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:albumId", (req, res, next) => {
  // .getArtistAlbums() code goes here
  console.log("VIEWING ALBUMs");
  console.log(req.params);
  spotifyApi.getAlbumTracks(req.params.albumId).then(
    function (data) {
      console.log("TIENE TRACKS");
      console.log("Tracks", data.body);
      res.render("tracks", {
        tracks: data.body,
      });
    },
    function (err) {
      console.error(err);
    }
  );
});

// I NEED TO IMPROVE THE CSS, IT's really bad right now
