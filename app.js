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
  // console.log(clientId, clientSecret)
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
//home page
app.get("/", (req, res) => {
  res.render("index");
});

//Artists search
app.get("/artist-search", (req, res) => {
  const { artistName } = req.query;

  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const artistData = data.body.artists.items;
      console.log(artistData);
      res.render("artist-search-results", { artistData });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

//Artists Album
app.get("/albums/:artistId", (req, res) => {
  // .getArtistAlbums() code goes here
  let { artistId } = req.params;

  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      console.log("The received data from the API: ", data);
      const albumsInfo = data.body.items;
      res.render("albums", { albumsInfo });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

// Albums tracks
app.get("/tracks/:albumId", (req, res) => {
  const { albumId } = req.params;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      console.log("The received data from the API: ", data);
      const tracksInfo = data.body.items;
      res.render("tracks", {tracksInfo})
    })
    .catch((err) =>
      console.log("The error while searching tracks occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
