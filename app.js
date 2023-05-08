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

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

// Display results for artist search
app.get("/artist-search", async (req, res) => {
  try {
    let response = await spotifyApi.searchArtists(req.query.characters);
    //console.log(
    // response.body.artists.items /* response.body.artists.items[0] */
    //);
    res.render("artist", { result: response.body.artists.items }); // result becomes new name for response.body etc
  } catch (error) {
    console.error(error);
  }
});

app.get("/albums/:artistId", async (req, res) => {
  try {
    let responseAlbums = await spotifyApi.getArtistAlbums(req.params.artistId);
    let allAlbums = responseAlbums.body.items;
    //console.log(allAlbums[0].images);
    res.render("albums", { allAlbums });
  } catch (error) {
    console.error(error);
  }
});

app.get("/viewtracks/:albumId", async (req, res)=> {
  try {
    let albumSongs = await spotifyApi.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ', {req.params.albumId})
  }
})


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
