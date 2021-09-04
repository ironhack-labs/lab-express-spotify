require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "../public"));
app.use(express.urlencoded({ extended: true }));

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
app.get("/", (req, res) => {
  res.render("home-page");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((response) => {
      console.log("The received data from the API: ", response.body.artists);
      res.render("artist-search-results", {
        artists: response.body.artists.items,
      });
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((response) => {
      console.log(response.body.items[0]);
      res.render("albums", { albums: response.body.items });
    })
    .catch((err) => console.log("Something went wrong uhh ohhh: ", err));
});

app.get("/tracks/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((response) => {
      console.log({ tracks: response.body.items });
      res.render("tracks", { tracks: response.body.items });
    })
    .catch((err) => console.log("Something went wrong uhh ohhh: ", err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
