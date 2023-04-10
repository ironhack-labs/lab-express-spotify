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
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error => console.log("Something went wrong when retrieving an access token", error));

// Our routes go here:

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  // deconstruccón de objetos. Req.query contiene el valor de lo que hayamos asignado en el name del input
  const { searchArtist } = req.query;
  spotifyApi
    //   .searchArtists(req.query.searchArtist)
    .searchArtists(searchArtist)
    .then(data => {
      // console.log("The received data from the API", data.body);
      const artistsResults = data.body.artists.items;
      // console.log(artistsResults[0].images);
      res.render("artist-search-results", { artistsResults });
    })
    .catch(err => console.log("The error while searching artists occurred: ", err));
});

app.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi.getArtistAlbums(artistId).then(data => {
    const artistAlbums = data.body.items;
    // console.log("Artists albums info", artistAlbums);
    res.render("albums", { artistAlbums });
  });
});

app.get("/tracks/:albumId", (req, res, next) => {
  const { albumId } = req.params;
  console.log("Params", albumId);

  spotifyApi.getAlbumTracks(albumId).then(data => {
    const albumTracks = data.body.items;
    console.log("Albums tracks:", albumTracks);
    res.render("tracks", { albumTracks });
  });
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
