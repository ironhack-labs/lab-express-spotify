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
  const name = req.query.name;

  if (name) {
    spotifyApi
      .searchArtists(name)
      .then((data) => {
        const artist = data.body.artists.items;
        res.render("artist-search-results", { artist });
      })
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      );
  } else {
    res.render("index");
  }
});

app.get("/albums/:id", (req, res, next) => {
  const id = req.params.id;

  spotifyApi
    .getArtistAlbums(id)
    .then((data) => {
      const albuns = data.body.items;
      res.render("artist-albun-detail", { albuns });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/tracks/:id", (req, res, next) => {
  const id = req.params.id;

  spotifyApi
    .getAlbumTracks(id, { limit: 50, offset: 1 })
    .then((data) => {
      const tracks = data.body.items;
      res.render("artist-tracks", { tracks });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
