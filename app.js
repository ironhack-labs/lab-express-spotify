require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node"); // TODO Requiere Spotify

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// TODO Setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  // * Here we store our passwords and validations as a secret thank to dotenv npm package ! The file we need for that .env is safe as well on our commits because we included it on our .gitignore

  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// TODO Retrieve an acces token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// TODO Our routes go here:
// * Home Route
app.get("/", (req, res, next) => {
  res.render("home");
});

// * artist-search-result Route
app.get("/artist-search", (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist).then(
    function (data) {
      // console.log(data.body.artists.items[0].images[0].url);
      let result = data.body.artists.items;
      res.render("artist-search-results.hbs", { result });
    },
    function (err) {
      console.error(err);
    }
  );
});

// * Album Route
app.get(
  "/albums/:artistId",
  (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId).then(function (data) {
      // console.log(data.body.items);
      res.render("albums", { data: data.body.items });
    });
  },
  function (err) {
    console.error(err);
  }
);

// * Track Information Route
app.get(
  "/tracks/:albumId",
  (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId).then(function (data) {
      // console.log(data.body.items);

      res.render("tracks", { data: data.body.items });
    });
  },
  function (err) {
    console.error(err);
  }
);

// Listener...
app.listen(4000, () =>
  console.log("My Spotify project running on port 4000 🎧 🥁 🎸 🔊")
);
