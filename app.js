require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

//maybe the middlware goes here:

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

//for the muddleawrer:  !!! aqui!!!

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

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/artist-search", (req, res, next) => {
  console.log(req.query.artistName);
  const { artistName } = req.query;
  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/artist-albuns/:artistId", (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      console.log(data.body.items);
      res.render("artist-album", { artists: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/tracks/:artistId", (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi
    .getAlbumTracks(artistId)
    .then((data) => {
      console.log(data.body.items);
      res.render("tracks", { artists: data.body.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
