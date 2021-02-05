require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

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

// require spotify-web-api-node package here:
const app = express();
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
// setting the spotify-api goes here:

// Our routes go here:
app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.name)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      const artist = {
        artist: data.body.artists.items,
      };

      res.render("artist-search-results", artist);
    })

    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.id).then((data) => {
    const albums = {
      albums: data.body.items,
    };

    res.render("albums", albums);
  });
});

app.get("/tracks/:id", (req, res) => {
  spotifyApi.getAlbumTracks(req.params.id).then((data) => {
    console.log(data.body.items);
    const tracks = {
      tracks: data.body.items,
    };
    res.render("tracks", tracks);
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
