require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

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

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const queryString = req.query.q;
  spotifyApi
    .searchArtists(queryString)
    .then((data) => {
      console.log("THIS IS ARTIST SEARCH", data.body.artists.items);
      //   console.log("The received data from the API: ", data.body.artists.items);
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  const artistsID = req.params.artistId;
  spotifyApi.getArtistAlbums(artistsID).then(
    function (data) {
      console.log("THIS IS THE ALBUMS LOG: ", data.body.items);
      console.log(data.body.items.artists);
      //   console.log("Artist albums", data.body.artists.items.artistsId);
      res.render("albums", { albums: data.body.items });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:albumId", (req, res, next) => {
  console.log("HEEEELLLLOOOO");
  const albumID = req.params.albumId;
  
  spotifyApi.getAlbumTracks(albumID).then(function (data) {
      console.log("THIS IS THE TRACKS", data.body.items);
      res.render("tracks", { tracks: data.body.items });
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
