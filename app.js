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

// Retrieve an access token
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

//
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const artistSearch = req.query.artist;

  spotifyApi
    .searchArtists(artistSearch)
    .then((data) => {
      const artistList = data.body.artists.items;
      console.log("The received data from the API: ", artistList);
      res.render("artist-search-results", { artistLists: artistList });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  const artistId = req.params.artistId;
  //console.log(artistId);
  spotifyApi.getArtistAlbums(artistId).then((data) => {
    const albumList = data.body.items;
    //console.log(data.body);
    res.render("albums", { artistLists: albumList });
  });
});

app.get("/viewtracks/:albumId", (req, res) => {
  const albumId = req.params.albumId;
  console.log(albumId);
  spotifyApi.getAlbumTracks(albumId).then((data) => {
    const songList = data.body.items;
    console.log(data.body.items);
    res.render("viewtracks", { songLists: songList });
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
