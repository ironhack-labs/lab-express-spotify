require("dotenv").config();

const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const hbs = require("hbs");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.get("/", (req, res) => {
  res.render("home-page");
});

app.get("/artist-search/", (req, res) => {
  const { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      res.render("artists-search-results", {
        artists: data.body.artists.items,
      });
      //   console.log("The received data from the API: ", data.body.artists.items);
      //   res.send(data.body.artists.items);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  const { artistId } = req.params;

  spotifyApi
    .getArtistAlbums(artistId, { limit: 10 })
    .then((data) => {
      res.render("albums", { albums: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/preview-tracks/:albumId", (req, res) => {
  const { albumId } = req.params;

  spotifyApi
    .getAlbumTracks(albumId, { limit: 6 })
    .then((data) => {
      res.render("view-tracks", { tracks: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
