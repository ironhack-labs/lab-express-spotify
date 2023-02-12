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
  res.render("home");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      let searchedArtistsData = data.body.artists.items;
      res.render("artist-search-results", { searchedArtistsData });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let albumsData = await spotifyApi.getArtistAlbums(id);
    let artist = await spotifyApi.getArtist(id);
    let artistName = artist.body.name;
    console.log(artistName);
    res.render("albums", { allAlbums: albumsData.body.items, artistName });
  } catch (error) {
    console.log("The error while searching albums occurred: ", error);
  }
});

app.get("/tracks/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let tracksData = await spotifyApi.getAlbumTracks(id);
    res.render("tracks", { albumTracks: tracksData.body.items });
    console.log(tracksData.body.items);
  } catch (error) {
    console.log("The error while searching tracks occurred: ", error);
  }
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
