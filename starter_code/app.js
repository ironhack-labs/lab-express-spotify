const express = require("express");
const hbs = require("hbs");
const path = require("path");
var SpotifyWebApi = require("spotify-web-api-node");

require("dotenv").config();
console.log(typeof process.env.CLIENT_ID);
const PORT = process.env.PORT || 3000;

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res, next) => {
  let data = {
    image: "/images/background.jpeg"
  };
  res.render("index", data);
});

app.get("/artists", (req, res, next) => {
  let artist = req.query.artist;
  spotifyApi.searchArtists(artist).then(
    function(data) {
      let artists = { ...data.body.artists.items };
      res.render("artists", { artists, artist });
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get("/albums/:artistId", (req, res, next) => {
  let artistId = req.params.artistId;
  spotifyApi.getArtistAlbums(artistId).then(
    function(data) {
      let albums = data.body.items;
      albums = { ...albums };
      //   res.json(albums);
      res.render("albums", { albums });
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:albumId", (req, res, next) => {
  let albumId = req.params.albumId;

  spotifyApi.getAlbumTracks(albumId, { limit: 20, offset: 0 }).then(
    function(data) {
      let tracks = data.body.items;
      //   res.json(tracks);
      res.render("tracks", { tracks });
    },
    function(err) {
      console.log("Something went wrong!", err);
    }
  );
});
console.log("The value of PORT is:", process.env.PORT);

app.listen(PORT, () =>
  console.log(`My Spotify project running on port ${PORT}`)
);
