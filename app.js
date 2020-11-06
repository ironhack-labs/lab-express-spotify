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
spotifyApi.clientCredentialsGrant().then(
  function (data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function (err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

// Our routes go here:
app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artistSearch)
    .then((data) => {
      const artists = data.body.artists.items;
      res.render("artist-search-results", { artists });
    })
    .catch((err) => console.error(err));
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then((data) => {
    const albums = data.body.items;
    console.log(albums);
    res.render("albums", { albums });
  });
});

app.get("/tracks/:albumId", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId).then((data) => {
    const tracks = data.body.items;
    console.log(tracks);
    res.render("tracks", { tracks });
  });
});

app.get("/", (req, res, next) => {
  res.render("index");
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
