require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + ""));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: (process.env.clientId = "4777b1671d16413b83dbc761dac18401"),
  clientSecret: (process.env.clientSecret = "40689cdbd8ea4505a15efdc1f05e7e8d")
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error =>
    console.log("Something went wrong when retrieving an access token", error)
  );
// Our routes go here:

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/main.html");
});
app.get("/artist", (req, res) => {
  spotifyApi
    .searchArtists(req.query.album)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items);
      const myArtist = data.body.artists.items;
      console.log(myArtist);
      res.render("album", {
        myArtist
      });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});
app.get("/albums", (req, res) => {
  spotifyApi
    .searchAlbums(req.query.albumsart)
    .then(data => {
      console.log("The received data from the API:  ");
      const myalb = data.body.albums.items;
      // console.log(data.body.albums.items);
      res.render("albums_artist", {
        myalb
      });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});
app.get("/songs", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.query.album)
    .then(data => {
      console.log("The received data from the API:  ");
      const myalbsong = data.body.tracks.items;
      // console.log(data.body.albums.items);
      res.render("songs", {
        myalbsong
      });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/idsong", (req, res) => {
  spotifyApi
    .getTrack(req.query.namesong)
    .then(data => {
      console.log("The received data from the API:  ");
      const songid = data.body.itens.tracks;
      // console.log(data.body.albums.items);
      res.render("idsong", {
        songid
      });
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);