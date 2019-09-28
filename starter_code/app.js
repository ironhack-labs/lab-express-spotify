require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

app.get("/", (req, res, next) => res.render("index"));

app.get("/artists", (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist).then(
    data => {
      console.log(`Search artists by "${req.query.artist}"`, data.body.artists.items);
      res.render("artists", { artists: data.body.artists.items });
    },
    err => {
      console.error(err);
    }
  );
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(albuns => {
      console.log(albuns.body.items);
      res.render("albuns", { albuns: albuns.body.items });
    })
    .catch(err => {
      throw new Error(err);
    });
});

app.get("/musics/:albumId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(musics => {
      console.log(musics.body.items);
      res.render("musics", { musics: musics.body.items });
    })
    .catch(err => {
      throw new Error(err);
    });
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
