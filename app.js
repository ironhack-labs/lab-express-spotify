require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
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

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) => console.log("Something went wrong when retrieving an access token", error));

// Our routes go here:
app.get("/", (req, res, next) => res.render("index", {}));

app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.q)
    .then((data) => {
      const dataForFront = data.body.artists.items.map((item) => ({
        id: item.id,
        name: item.name,
        isArtist: true,
        image_url: item.images[0]?.url,
      }));
      res.render("artists", { search: req.query.q, artists: dataForFront });
    })
    .catch((error) => console.log("Error while searching artists occured: ", error));
});

app.get("/albums/:artistId", async (req, res, next) => {
  try {
    let data = await spotifyApi.getArtistAlbums(req.params.artistId);
    const dataForFront = data.body.items.map((item) => ({
      id: item.id,
      name: item.name,
      image_url: item.images[0]?.url,
    }));
    data = await spotifyApi.getArtist(req.params.artistId);

    res.render("albums", { search: data.body.name, albums: dataForFront });
  } catch (error) {
    console.log("Error while searching albums occured: ", error);
  }
});

app.get("/tracks/:albumId", async (req, res, next) => {
  try {
    let data = await spotifyApi.getAlbumTracks(req.params.albumId);
    const dataForFront = data.body.items.map((item) => ({
      id: item.id,
      name: item.name,
      preview_url: item?.preview_url,
    }));
    data = await spotifyApi.getAlbum(req.params.albumId);

    res.render("tracks", { search: data.body.name, tracks: dataForFront });
  } catch (error) {
    console.log("Error while searching tracks occured: ", error);
  }
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
