require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

//index.hbs HOME PAGE
app.get("/", (req, res) => {
  res.render("index");
});

// SEARCH
app.get("/artist-search-results", (req, res) => {
  const artistName = req.query.newArtist;
  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      res.render("artist-search-results", data.body.artists.items);
    })
    .catch((err) => console.log("An err while searching has appeared: ", err));
});

app.get("/albums/:artistId", (req, res) => {
  console.log(req.params);
  res.send(`info about albums.... ${req.params.artistId}`);
  spotifyApi.getArtistAlbums({ id: req.params.artistId }).then(
    (data) => {
      console.log("Artist albums", data.body.artists.items.albums);
    },
    function (err) {
      console.error(err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
