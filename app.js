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

app.get("/artist-search", async (req, res) => {
  try {
    let searchArtist = await spotifyApi.searchArtists(req.query.search);
    /* console.log(searchArtist.body.artists.items);  */
    let allResults = searchArtist.body.artists.items;
    console.log(allResults[0].images[0].url);
    /* let allInfo = data.body.artists.items */
    res.render("artist-search", { allResults });
  } catch (error) {
    console.log(error);
  }
});

app.get("/albums/:artistId", async (req, res, next) => {
  // .getArtistAlbums() code goes here
  let { artistId } = req.params;
  try {
    let searchAlbums = await spotifyApi.searchAlbums(artistId);
    /*         console.log(artistId) */

    res.render("albums", { searchAlbums });
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
