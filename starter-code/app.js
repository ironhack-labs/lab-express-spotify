require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const clientId = "b1b5be60a1474870b05af959b0de89f3";
const clientSecret = "5c44e4bafe0e43f4b9f8a3d6c31776f5";

let spotifyApi = new SpotifyWebApi({
  //   clientId: process.env.SPOTIFY_ID,
  //   clientSecret: process.env.SPOTIFY_SECRET

  clientId: clientId,
  clientSecret: clientSecret
  //   redirectUri: "http://www.example.com/callback"
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    console.log("The access token is " + data.body["access_token"]);
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index.hbs");
});

app.get("/artist-search", (req, res) => {
  //   console.log(req.query.artist);
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      //   console.log("Artist information", data.body.artists.items);
      //   res.send(data.body.artists.items);

      //   console.log(
      //     data.body.artists.items.forEach(item => {
      //       //   console.log("image-item: ", item.images);
      //       item.images.forEach(image => console.log(image.url));
      //     })
      //   );
      res.render("artist-search.hbs", {
        searchResults: data.body.artists.items
      });
    })
    .catch(err => console.log(err));
});

app.get("/albums/:artistId", (req, res) => {
  //   console.log("request.params: ", req.params.artistId);
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      //   console.log(data.body.items);
      //   res.send(data.body);
      res.render("albums.hbs", {
        albumList: data.body.items
      });
    })
    .catch(err => console.log(err));
});

app.get("/songs/:albumId", (req, res) => {
  //   console.log(req.params.albumId);
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
      console.log("Go songs to play!");
      console.log(data.body.items);
      //   res.send(data.body.items);
      res.render("album-songs.hbs", { songList: data.body.items });
    })
    .catch(err => console.log(err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
