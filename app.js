require("dotenv").config();

const express = require("express");
const { render } = require("express/lib/response");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// retrieve access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

//Search results

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.searchParam)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      data.body.artists.items.forEach((element) => {
        if (element.images.length === 0)
          element.images.push({
            url: "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2",
          });
      });
      res.render("artist-search-results", {
        artist: data.body.artists.items,
        search: req.query.searchParam,
      });
    })
    .catch((err) =>
      console.log("An error while searching for artists occurred: ", err)
    );
});

// Albums

app.get("/albums/:artistId", function (req, res, next) {
  spotifyApi
    .getArtist(req.params.artistId)
    .then((data) => {
      return data.body;
    })
    .then((artist) => {
      spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then((data) => {
          if (artist.images.length === 0)
            artist.images.push({
              url: "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2",
            });
          res.render("albums", {
            albums: data.body.items,
            artist: artist,
          });
        })
        .catch((err) =>
          console.log("The error while searching artists occurred: ", err)
        );
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// Album tracks

app.get("/albumSongs/:albumId", function (req, res, next) {
  spotifyApi
    .getAlbum(req.params.albumId)
    .then((data) => {
      console.log(data.body);
      return data.body;
    })
    .then((album) => {
      spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then((data) => {
          res.render("album-tracks", {
            songs: data.body.items,
            album: album,
          });
        })
        .catch((err) =>
          console.log("The error while searching artists occurred: ", err)
        );
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
