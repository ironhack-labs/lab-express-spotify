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

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artistName)
    .then((artist) => {
      console.log(
        "The received data from the API: ",
        artist.body.artists.items
      );
      const artistResult = artist.body.artists.items;

      res.render("artist", { artistResult });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((album) => {
      console.log("Albums accessed with success!");

      const albumResult = album.body.items;

      res.render("albums", { albumResult });
      console.log(albumResult);
    })
    .catch((err) =>
      console.log("The error while getting the albums occurred: ", err)
    );
});

app.get("/tracks/:trackId", (req, res, next) => {
  const { trackId } = req.params;
  spotifyApi
    .getAlbumTracks(trackId)
    .then((tracks) => {
      console.log("tracks accessed with success!");

      const tracksResult = tracks.body.items;
      res.render("Tracks", { tracksResult } );
      console.log(tracksResult);
    })
    .catch((err) =>
      console.log("The error while getting the albums occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);