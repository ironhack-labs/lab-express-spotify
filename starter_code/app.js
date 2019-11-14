require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

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
  res.render("index");
});

app.post("/artists", (req, res) => {
  let spotyArtist = req.body.artist;
  console.log(spotyArtist)
  spotifyApi
    .searchArtists(spotyArtist)
    .then(data => {
      let artistData = data.body.artists.items;
      console.log("The received data from the API: ", data.body);
      res.render("artists", { artistData });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:id", (req, res) => {
    let albumId = req.params.id;
    spotifyApi
      .getArtistAlbums(albumId)
      .then(data => {
        let albumData = data.body.items;
        res.render("albums", {albumData});
      })
      .catch(err => {
        console.log("The error while searching artists occurred: ", err);
      });
  });


  app.get("/tracks/:id", (req, res) => {
    let trackId = req.params.id;
    spotifyApi
      .getAlbumTracks(trackId)
      .then(data => {
        let trackData = data.body.items;
        res.render("tracks", {trackData});
      })
      .catch(err => {
        console.log("The error while searching artists occurred: ", err);
      });
  });

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
