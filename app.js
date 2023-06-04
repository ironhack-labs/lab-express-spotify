require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
    console.log("Worked", data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
   spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      const artistsArr = data.body.artists.items;
      console.log("The received data from the API:", data.body);
      res.render("artist-search-results", { artistsArr });
    })
    .catch((err) => {
      console.log("Artist not found!", err);
      res.send("Artist not found!");
    });
})

app.get("/albums/:artistId", (req, res, next) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      const albums = data.body.items;
      res.render("albums", { albums });
    })
    .catch((err) => console.log("Album not found!", err));
});

app.get("/tracks/:albumId", (req, res, next) => {
    const albumId = req.params.albumId;
    spotifyApi
      .getAlbumTracks(albumId)
      .then((data) => {
        console.log(data.body.items);
        const tracks = data.body.items;
        res.render("tracks", { tracks });
      })
      .catch((err) => console.log("Tracks not found!", err));
  });

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
