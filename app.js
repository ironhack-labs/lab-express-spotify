require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    //I get the access token
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.get("/artist-search", (req, res) => {
  const { artist } = req.query;

  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      //console.log(data.body.artists.items);
      let receivedDataFromApi = data.body.artists.items;

      res.render("artist-search-results", { receivedDataFromApi });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

//GET ALBUM LIST FROM AN ARTIST
app.get("/albums/:artistId", (req, res, next) => {
  let artistId = req.params.artistId;
  spotifyApi.getArtistAlbums(artistId).then(
    function (data) {
      let receivedDataArtistId = data.body.items;
      res.render("artistId-search-results", { receivedDataArtistId });
    },
    function (err) {
      console.error(err);
    }
  );
});

//GET TRACK LIST
app.get("/albums/:albumid/tracks", (req, res, next) => {
  let albumId = req.params.albumid;
  console.log(albumId);
  spotifyApi.getAlbumTracks(albumId).then(
    function (data) {
      let receivedDataAlbumId = data.body.items;
      console.log(receivedDataAlbumId);
      res.render("albumid-search-results", { receivedDataAlbumId });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
