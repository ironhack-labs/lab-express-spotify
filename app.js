require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const axios = require("axios");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
// Retrieve an access token

// Our routes go here:
app.get("/", (req, res, next) => {
  console.log("homepage request");
  res.render("main");
});

app.get("/artist-search", (req, res, next) => {
  // res.send(req.query.artist);
  const artist = req.query.artist;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      const artist = data.body.artists.items[0];
      const name = artist.name;
      const image = artist.images[0].url;
      const id = artist.id;
      res.render("artist-search-results", { image, name, id });
    })
    .catch((err) => console.log(err));
});

app.get("/albums/:artistID", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistID).then((data) => {
    //const albumsArr = data.body.items[0].images;
    const albumsArr = data.body.items;
    const albumDetailsArr = [];
    for (let i = 0; i < albumsArr.length; i++) {
      albumDetailsArr.push({
        albumName: albumsArr[i].name,
        albumImage: albumsArr[i].images[0].url,
        albumID: albumsArr[i].id,
      });
    }
    //res.send(albumsArr[0].id);
    res.render("albums", { albumDetailsArr });
  });
});

app.get("/albums/:albumID/tracks", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumID).then((data) => {
    const tracksArr = data.body.items;
    const arrayOfTracks = [];
    for (let i = 0; i < tracksArr.length; i++) {
      arrayOfTracks.push({
        name: tracksArr[i].name,
        previewurl: tracksArr[i].preview_url,
      });
    }
    //res.send(tracksArr[1]);
    res.render("tracks", { arrayOfTracks });
  });
});

app.listen(3001, () =>
  console.log("My Spotify project running on port 3001 🎧 🥁 🎸 🔊")
);
