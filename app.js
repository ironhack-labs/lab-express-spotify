require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

// SET THE VIEW TEMPLATE ENGINE
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) => console.log("Something went wrong when retrieving an access token", error));

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Our routes go here:
// GET / - Renders Home Page

app.get("/", (req, res) => {
  res.render("index");
});

// GET /artist-search
app.get("/artist-search", (req, res) => {
  const artistName = req.query.artistName;
  spotifyApi
    .searchArtists(artistName)
    .then((artistName) => {
      const itemsList = artistName.body.artists.items;
      res.render("artist-search-results", { itemsList });
    })
    .catch((err) => console.log("The error while searching artists occurred: ", err));
});

// GET /albums
app.get("/albums/:artistId", (req, res, next) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((oneArtist) => {
      //console.log(oneArtist.body.items[0]);
      const albumsList = oneArtist.body.items;
      res.render("albums", { albumsList });
    })
    .catch((err) => {
      console.log(err);
    });
});

// GET /tracks
app.get("/tracks/:albumsId", (req, res) => {
  const albumsId = req.params.albumsId;
  spotifyApi
    .getAlbumTracks(albumsId)
    .then((oneAlbum) => {
      const trackList = oneAlbum.body.items;
      res.render("tracks", { trackList });
    })
    .catch((err) => {
      console.log(err);
    });
});

// START THE SERVER
app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
