require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
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
// app.get("/", (req, res, next) => {
//     spotifyApi
//         .searchArtists("madonna")
//         .then(data => {
//             console.log(data.body.artists.items[0].images)
//         })
//         .catch(error => console.log(error))

// })
// Our routes go here:

app.get("/", (req, res, next) => {
  res.render("home-page");
});

app.get("/artist-search", (req, res, next) => {
  const artistsName = req.query.artist;
  //console.log(artistsName);

  spotifyApi
    .searchArtists(artistsName)
    .then((data) => {
      //console.log("The received data from the API: ", data.body.artists.items);
      const artistArr = data.body.artists.items;
      res.render("artist-search-results", { artistArr });
    })
    .catch((e) =>
      console.log("This Artist is not ir our DB, we will fix this ASAP!", e)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  //console.log(req.params)
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      //console.log(data.body.items);
      const albumsArr = data.body.items;
      res.render("albums", { albumsArr });
    })
    .catch((e) => console.log("No albums to show", e));
});

app.get("/tracks/:albumId", (req, res, next) => {
  //console.log(req.params);
  const albumId = req.params.albumId;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      //console.log(data.body.items);
      const tracksArr = data.body.items;
      res.render("tracks", { tracksArr });
    })
    .catch((e) => console.log("No tracks to show", e));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
