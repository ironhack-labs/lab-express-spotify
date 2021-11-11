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
  .catch((error) => console.log("Something went wrong when retrieving an access token", error));

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const { artistName } = req.query;

  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      //   console.log("T0 he received data from the API: ", data.body.artists);
      const artists = data.body.artists.items;
      res.render("artist-search-results.hbs", { artists });
    })
    .catch((err) => console.log("The error while searching artists occurred: ", err));
});

app.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;
  //   console.log("-----------------------", req.params);

  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      //   console.log(data.body.items);
      const albums = data.body.items;
      // res.send(albums);
      res.render("album.hbs", { albums });
    })
    .catch((err) => console.log("The error while searching artists occurred: ", err));
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
