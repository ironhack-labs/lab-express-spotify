require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  // use POST, creating an environment variable, .env is to grab that info
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
    console.log(`This worked!`, data.body["access_token"]);
  })

  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Our routes go here:

app.get("/", (req, res, next) => {
  res.render("home-page");
});

// setting the spotify-api goes here:
app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist /* get artist name from query string*/)
    .then((data) => {
      console.log(data.body.artists.items);
      res.render("artist-search-results", data.body.artists.items);
    })
    .catch((error) => console.log(error));
});

// app.get("", (req, res) => {
//   res.render("artist-search-results", artists);
// });

app.get("/albums/:artistId", (req, res) => {
  console.log(req.params);
  spotifyApi
    .getArtistAlbums(req.query.albums /*get albums*/)
    .then((albums) => {
      console.log(`Artist Albums: `, albums.body);
      res.render("albums-results", albums.body);
      return spotify.getAlbumTracks();
    })
    .then("/tracks/:albumId", (res, req) => {
      spotifyApi.getAlbumTracks(req.query.tracks); //get album tracks
      console.log(`Here are the album tracks: `, tracks.body);
      res.render("tracks-results", tracks.body);
    })
    .catch((e) => console.log("Error getting info", e));
});

// const artist = req.params.artistName;
// const album = req.params.albumName;

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
