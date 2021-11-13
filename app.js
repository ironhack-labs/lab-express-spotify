require("dotenv").config();

const express = require("express");
const { registerPartial } = require("hbs");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
hbs.registerPartial(__dirname + "views", "partials");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an acces token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", async (req, res) => {
  //   const artists = await spotifyApi.searchArtists();
  res.render("index");
});

app.get("/search-artist", async (req, res) => {
  const artists = await spotifyApi.searchArtists(req.query.name);
  res.render("search", { ...artists.body.artists.items });
});

app.get('/album/:_id', async (req, res) => {

    const albums = await spotifyApi.getArtistAlbums(req.params._id);
    console.log(...albums.body.items) 
    res.render("album", {...albums.body.items });

})
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
