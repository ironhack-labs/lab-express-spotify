require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

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
  res.render("home", {});
});

app.get("/artist-search", (req, res, next) => {
  const { search } = req.query;
  spotifyApi
    .searchArtists(search)
    .then((data) => {
      //console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

      const artists = data.body.artists.items;
      const viewAlbums = true;

      const artistData = {
        info: artists.map((artist) => {
          return {
            ...artist,
            viewAlbums,
          };
        }),
      };
      return res.render("artist-search-results", artistData);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  // .getArtistAlbums() code goes here
  const { artistId } = req.params;
  const viewTracks = true;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      //console.log("The received data from the API: ", data.body);
      const albums = data.body.items;
      const albumsData = {
        info: albums.map((album) => {
          return {
            ...album,
            viewTracks
          };
        }),
      };
      res.render("albums", albumsData);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:albumId/tracks", (req, res, next) => {
  const { albumId } = req.params;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      //console.log("The received data from the API: ", data.body);
      const tracks = data.body.items;
      res.render("tracks", { tracks });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
