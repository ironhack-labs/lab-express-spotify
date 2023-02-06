require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

// home route
app.get("/", async (req, res) => {
  //   res.send("welcome home");
  res.render("home");
});

// search for artists
app.get("/artist-search", (req, res) => {
  const { artist } = req.query;

  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      //   console.log(data);
      const artists = data.body.artists.items;
      //   const id = data.body.artists.items[0].id;
      //   console.log(id);
      //   console.log(artists);
      //   console.log(artists[0].images[0]);
      // res.render("artist-search-results", { artists });
      res.render("artists", { artists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// search for albums
app.get("/albums/:artistId", (req, res) => {
  const id = req.params.artistId;
  console.log(id);

  spotifyApi
    .getArtistAlbums(id)
    .then((data) => {
      console.log(data.body.items);
      const albums = data.body.items;
      res.render("albums", { albums });
    })
    .catch((err) => console.log("OH NO! ERROR FETCHING ALBUMS", err));
});

// search for tracks
app.get("/tracks/:trackId", (req, res) => {
  const id = req.params.trackId;
  console.log(id);
  // Get tracks in an album
  spotifyApi
    .getAlbumTracks(id)
    .then((data) => {
      console.log("TRACKS DATA IS HERE");
      console.log(data.body.items);
      const tracks = data.body.items;
      tracks.forEach((track) => console.log(track.name));
      // res.send("getting tracks");
      res.render("tracks", { tracks });
    })
    .catch((err) => console.log(err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
