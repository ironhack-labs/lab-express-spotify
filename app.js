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

//Before routs
//Middleware for parsing json and form-data requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", async (req, res) => {
  //console.log("req.query", req.query);
  const artist = req.query.artist;

  const data = await spotifyApi.searchArtists(artist);

  const artistList = data.body.artists.items;
  //console.log("data.body.artists", data.body.artists.items[0];
  res.render("artist-search-results", { artistList });
});

app.get("/albums/:artistId", async (req, res) => {
  console.log("req.params", req.params.artistId);
  const artistId = req.params.artistId;

  const data = await spotifyApi.getArtistAlbums(artistId); //
  const albumsList = data.body.items;
  //console.log("data.body", data.body);
  res.render("albums", { albumsList });
});

app.get("/tracks/:someId", async (req, res) => {
  const someId = req.params.someId;

  const data = await spotifyApi.getAlbumTracks(someId);
  const tracksList = data.body.items;
  res.render("tracks", { tracksList });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
