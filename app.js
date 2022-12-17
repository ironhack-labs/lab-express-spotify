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

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", async (req, res) => {
  const data = await spotifyApi.searchArtists(req.query.artist);
  const dataToRender = [];
  for (artist of data.body.artists.items) {
    dataToRender.push({
      name: artist.name,
      imageURL: artist.images.length === 0 ? '' : artist.images[0].url,
      linkURL: artist.external_urls.spotify,
    });
  }
  res.render("artist-search-results", { dataToRender });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
