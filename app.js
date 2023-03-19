require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

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
  res.render("home");
});
app.get("/artist-search", (req, res) => {
  const artistName = req.query.artistName;
  spotifyApi
    .searchArtists(artistName)
    .then((data) => {
      // console.log(data.body.artists.items);
      const artistArr = [];
      data.body.artists.items.forEach((item) => {
        artistArr.push({
          name: item.name,
          img: item.images[0] ? item.images[0].url : "",
          id: item.id,
        });
      });
      console.log(artistArr);
      res.render("elementlist", { element: artistArr });
    })
    .catch((err) => console.error(err));
});
app.get("/artist-page/:id", (req, res) => {
  console.log(req.params.id);
  const artistId = req.params.id;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const albumArr = [];
      data.body.items.forEach((album) => {
        albumArr.push({
          name: album.name,
          img: album.images[0] ? album.images[0].url : null,
          id: album.id,
        });
      });
      res.render("elementlist", { element: albumArr });
      console.log(data.body.items[0].images);
    })
    .catch((err) => console.error(err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
