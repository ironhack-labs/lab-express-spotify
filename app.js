require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const path = require("path");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));


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

// This route renders the home page
app.get("/", (req, res) => {
  res.render("home");
}); 

// This route renders the artist-search-result page
app.get("/artist-search", async (req, res, next) => {
  try {
    const query = req.query.name;
    const searchArtistsResponse = await spotifyApi.searchArtists(query);
    const artists = searchArtistsResponse.body.artists.items;
    console.log(artists);
    res.render("artist-search-result", { artists });
  } catch (err) {
    console.log(`this is your error: ${err}`);
  }
});

// This route renders the albums page
app.get("/albums/:artistId", async (req, res, next) => {
  try {
    const artistId = req.params.artistId;
    const data = await spotifyApi.getArtistAlbums(artistId);
    const albums = data.body.items;
    res.render("albums", { albums });
  } catch (err) {
    console.log(`this is your error: ${err}`);
    }  
  });

// This route renders the tracks page
app.get("/tracks/:albumId", async (req, res, next) => {
  try {
    const albumId = req.params.albumId;
    const data = await spotifyApi.getAlbumTracks(albumId);
    const tracks = data.body.items;
    res.render("tracks", { tracks });
  } catch (err) {
    console.log(`this is your error: ${err}`);
    }  
  });

app.listen(4000, () => console.log('My Spotify project running on port 4000 🎧 🥁 🎸 🔊'));