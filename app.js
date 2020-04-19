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
    // console.log(data);
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res, next) => {
  res.render("index", { layout: false });
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi.searchArtists(req.query.artistSearch).then(
    function (data) {
      console.log('Search artists by "Love"', data.body.artists.items);
      //   res.send("artist-search-results", { data: data.body.artists.items });
      res.render("artist-search-results", { data: data.body.artists.items });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      //   res.send(data.body.items);
      res.render("albums", {
        albums: data.body.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/tracks/:id", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      // res.send(data.body.items);
      res.render("tracks", {
        tracks: data.body.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching tracks occurred: ", err)
    );
});

// Our routes go here:

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
