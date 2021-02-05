require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

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
  res.render("homepage");
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.search)
    .then((data) => {
      const artistsData = data.body.artists.items.map((elem) => ({
        name: elem.name,
        images: elem.images[0],
        id: elem.id,
      }));
      console.log(artistsData);
      return res.render("artist-search-results", { artistsData });
    })
    .catch((error) =>
      console.log("Something went wrong when retrieving an access token", error)
    );
});

app.get("/albums/:id", (req, res, next) => {
  // Get albums by a certain artist
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((data) => {
      const albumData = data.body.items.map((elem) => ({
        name: elem.name,
        images: elem.images[0],
        id: elem.id,
      }));

      console.log("Artist albums", data.body.items);
      return res.render("albums", { albumData });
    })
    .catch((error) =>
      console.log("Something went wrong when retrieving an access token", error)
    );
});

app.get("/tracks/:id", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then((data) => {
      const tracks = data.body.items.map((elem) => ({
        name: elem.name,
        preview: elem.preview_url,
      }));
      console.log(data.body.items);
      return res.render("tracks", { tracks });
    })
    .catch((err) => {
      console.log("Something went wrong when retrieving the artists", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
