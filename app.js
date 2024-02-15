require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:
const spotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

hbs.registerPartials(`${__dirname}/views/pages`);
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
//retrieve an access a token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.use(express.urlencoded({ extended: true }));

// Our routes go here:

app.get("/", (req, res, next) => {
  res.render("pages/homepage");
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.search_field)
    .then((data) => {
      const artist = data.body.artists.items;
      res.render("pages/artist-search-results", { artist });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res, next) => {
  const idArtist = req.params.id;
  spotifyApi
    .getArtistAlbums(idArtist)
    .then((data) => {
      const albums = data.body.items;

      res.render("pages/albums", { albums });
    })
    .catch((error) => next(error));
});

app.get("/tracks/:id", (req, res, next) => {
  const idTrack = req.params.id;
  spotifyApi
    .getAlbumTracks(idTrack, { limit: 5, offset: 1 })
    .then((data) => {
      const tracks = data.body.items;
      console.log("The received data from the API: ", tracks);
      res.render("pages/tracks", { tracks });
    })
    .catch((error) => next(error));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
