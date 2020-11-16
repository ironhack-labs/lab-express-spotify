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
// Basic index route, that renders a home page:
app.get("/", (req, res) => {
  res.render("index");
});

// artist-search routes, rendering artist-search-results
app.get("/artist-search", (req, res) => {
  console.log(req.query);
  const searchedArtist = req.query.artist;
  spotifyApi
    .searchArtists(searchedArtist)
    .then((data) => {
      const foundArtists = data.body.artists.items;
      //console.log(foundArtists);
      res.render("artist-search-results", { foundArtists });
    })
    .catch((err) => {
      console.log("The error while searching artists occurred: ", err);
      res.redirect("/");
    });
});

// Get Artit's-Albums routes, rendering albums
app.get("/albums/:artistId", (req, res) => {
  const artistId = req.params.artistId;
  //console.log("req.params.artistId =", artistId);
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      //console.log("DATA BODY: ", data.body.items);
      const albums = data.body.items;
      // console.log("DATA BODY ITEMS: ", albums);
      res.render("albums", { albums });
    })
    .catch((err) => {
      console.log("The error while searching albums of Artist occurred: ", err);
      res.redirect("/");
    });
});

// Get Tracks of the album, rendering tracks
app.get("/tracks/:albumId", (req, res) => {
  //console.log(req.params);
  const albumId = req.params.albumId;
  console.log("ALBUM ID: ", albumId);
  spotifyApi.getAlbumTracks(albumId, { limit: 5, offset: 1 }).then(
    function (data) {
      //console.log(data.body.items);
      const tracks = data.body.items;
      //console.log("DATA BODY ITEMS: ", tracks);
      res.render("tracks", { tracks });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(3756, () =>
  console.log("My Spotify project running on port 3756 🎧 🥁 🎸 🔊")
);
