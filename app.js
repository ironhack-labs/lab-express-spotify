require("dotenv").config();
const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const app = express();

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
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  //res.send(req.query.artistName);
  spotifyApi
    .searchArtists(req.query.artistName)
    .then((data) => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const artists = [];

      for (const artist of data.body.artists.items) {
        if (artist.images.length > 0)
          artists.push({
            name: artist.name,
            image: artist.images[1].url,
            artistId: artist.id,
          });
        else artists.push({ name: artist.name, artistId: artist.id });
      }
      res.render("artist-search-results", { artists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(function (data) {
      const albums = [];

      for (const album of data.body.items) {
        if (album.images.length > 0)
          albums.push({
            name: album.name,
            image: album.images[1].url,
            albumId: album.id,
          });
        else albums.push({ name: album.name, albumId: album.id });
      }
      res.render("album-search-results", { albums });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/tracks/:albumId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(function (data) {
      const tracks = [];

      for (const track of data.body.items) {
        tracks.push({
          name: track.name,
          audioUrl: track.preview_url,
        });
      }
      res.render("track-search-results", { tracks });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
