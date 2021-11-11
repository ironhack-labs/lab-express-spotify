require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
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

// const index = require("./routes/index");
// app.use("/", index);

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) => console.log("Something went wrong when retrieving an access token", error));

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const searchedArtist = req.query.artistname;
  spotifyApi
    .searchArtists(searchedArtist)
    .then((data) => {
      data.body.artists.items;
      res.render("artist-search-results", { artists: data.body.artists.items });
      // console.log(data.body.artists.items[0].id);
    })

    .catch((err) => console.log("The error while searching artists occurred: ", err));
});

app.get("/albums/:artistId", (req, res) => {
  const { artistId } = req.params;
  console.log(artistId);
  spotifyApi.getArtistAlbums(artistId).then((data) => {
    console.log(data.body.items);
    res.render("albums-results", { albums: data.body.items });
  });
});

app.get("/viewtracks/:albumid", (req, res) => {
  const { albumid } = req.params;
  console.log(albumid);
  spotifyApi.getAlbumTracks(albumid).then((data) => {
    console.log(data.body.items);
    res.render("songs-results", { songs: data.body.items });
  });
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
