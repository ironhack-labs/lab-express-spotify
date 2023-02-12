require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

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
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", async (req, res) => {
  try {
    let searchArtist = await spotifyApi.searchArtists(req.query.search);
    /* console.log(searchArtist.body.artists.items);  */
    let allResults = searchArtist.body.artists.items;

    res.render("artist-search", { artists: allResults });
  } catch (error) {
    console.log(error);
  }
});

app.get("/albums/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let searchAlbums = await spotifyApi.getArtistAlbums(id);
    console.log(searchAlbums.body.items);

    let allAlbums = searchAlbums.body.items;

    res.render("albums", { allAlbums });
  } catch (error) {
    console.log(error);
  }
});

app.get("/tracks/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let tracks = await spotifyApi.getAlbumTracks(id);
    console.log(tracks.body.items);

    let allTracks = tracks.body.items;

    res.render("tracks", { allTracks });
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
