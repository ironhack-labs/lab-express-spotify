require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

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
app.get("/", (req, res) => {
  res.render("home-page");
});

app.get("/artist-search", (req, res) => {
  const { artist } = req.query;
  console.log(artist);
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      // console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const searchArtistResults = data.body.artists.items;
      // console.log(data.body.artists.items);
      res.render("artist-search-results", { searchArtistResults });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      console.log("Here goes nothing:", data.body.items[0].artists[0].name);
      const albumsResults = data.body.items;
      const artistName = data.body.items[0].artists[0].name;
      res.render("albums", { albumsResults, artistName });
    })
    .catch((err) =>
      console.log("The error while searching artists albums occurred: ", err)
    );
});

app.get("/tracks/:albumId", (req, res, next) => {
  const { albumId } = req.params;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      // console.log("Here goes something:", data.body);
      const trackResults = data.body.items;
      res.render("tracks", { trackResults });
    })
    .catch((err) =>
      console.log("The error while searching artists albums occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
