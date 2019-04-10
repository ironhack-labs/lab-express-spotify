const express = require("express");
const hbs = require("hbs");
var Spotify = require("spotify-web-api-js");
var s = new Spotify();

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
// Remember to insert your credentials here
const clientId = "bc6a3788e7c44eccb42a2c29714540a8",
  clientSecret = "0940bc57eaee4abfbb1cf95ddaf07400";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
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

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// the routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist", (req, res, next) => {
  const { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      // res.json(data.body.artists.items);
      res.locals.spotifyList = data.body.artists.items;
      // res.locals.artistName = artist;
      res.render("artist.hbs");
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});
app.get("/album/:idArtist", (req, res, next) => {
  const { idArtist } = req.params;
  // return console.log(idArtist);
  spotifyApi
    .getArtistAlbums(idArtist)
    .then(data => {
      // res.json(data.body.items);
      // res.locals.albumList = album;
      res.render("album", { albums: data.body.items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});
app.get("/track/:idAlbum", (req, res, next) => {
  const { idAlbum } = req.params;
  // return console.log(idArtist);
  spotifyApi
    .getAlbumTracks(idAlbum)
    .then(data => {
      // res.json(data);
      // res.locals.albumList = album;
      res.render("track", { tracks: data.body.items });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
