require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials"); 

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body.access_token))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// ROUTE
app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/artist-search", async (req, res, next) => {
  const artist = req.query.artist;

  const spotifyArtist = await spotifyApi.searchArtists(artist);

  res.render("artistSearch", spotifyArtist.body.artists.items);
});

app.get("/albums/:artistId", async (req, res, next) => {
  const idAlbum = req.params.artistId;
  const spotifyAlbum = await spotifyApi.getArtistAlbums(idAlbum);
  res.render("albums",  spotifyAlbum.body.items);
});

app.get("/tracks/:trackId", async (req, res, next) => {
  const idtrack = req.params.trackId;
  const spotifyTrack = await spotifyApi.getAlbumTracks(idtrack);
  console.log(spotifyTrack.body.items)
  res.render("tracks",  spotifyTrack.body.items);
});
// Our routes go here:

app.listen(3001, () =>
  console.log("My Spotify project running on port 3001 🎧 🥁 🎸 🔊")
);
