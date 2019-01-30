const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Remember to insert your credentials here
const clientId = "beab1904bc2b44af810cbe3fcf26dfd7",
  clientSecret = "30df1271623e436180dcf5b9d07d860a";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// setting the spotify-api goes here:

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artists", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log("The received data from the API: ", data.body);
      res.render("artists", {
        artists: data.body.artists.items
      });
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then(data => {
    console.log("The received data from the API ALBUM: ", data.body);
    res.render("albums", {
      albums: data.body.items
    });
  });
});

app.get("/tracks/:albumId", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId).then(data => {
    console.log("The received data from the API ALBUM: ", data.body);
    res.render("albums", {
      tracks: data.body.items
    });
  });
});

// the routes go here:

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
