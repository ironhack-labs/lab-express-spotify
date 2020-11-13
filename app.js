log = console.log;

require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

// express
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

app.get("/", (req, resp) => {
  console.log("GET REQUEST, VISITNG HOME PAGE");
  resp.render("index");
});

app.get("/:artist-search", (req, resp) => {
  const { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      //console.log("The received data from the API: ", data.body);
      resp.render("artist-search-results", {
        artists: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, resp) => {
  const { artistId } = req.params;
  const { artist } = req.query;

  spotifyApi.getArtistAlbums(artistId).then((albums) => {
    resp.render("albums", [{ albums: albums.body.items }, { artist }]);
  });
});

app.get("/view-tracks/:albumId", (req, resp) => {
  const { albumId } = req.params;
  spotifyApi.getAlbumTracks(albumId).then((data) => {
    resp.render("view-tracks", { tracks: data.body.items });
  });
});

app.listen(3001, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
