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

// Our routes go here:

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

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  const { name } = req.query;
  spotifyApi
    .searchArtists(name)
    .then((data) => {
      const items = { items: data.body.artists.items };
      console.log(items);
      res.render("artist-search-results", items);
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  const id = req.params.artistId;
  spotifyApi
    .getArtistAlbums(id)
    .then((data) => {
      console.log("Artist albums", data.body);
      const items = { items: data.body.items };
      res.render("albums", items);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/tracks/:artistId", (req, res, next) => {
  const id = req.params.artistId;
  spotifyApi
    .getAlbumTracks(id, { limit: 5, offset: 1 })
    .then((data) => {
      console.log(data.body);
      const items = { items: data.body.items };
      res.render("tracks", items);
    })
    .catch((err) => {
      console.log("Something went wrong!", err);
    });
});

// Retrieve an access token

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
