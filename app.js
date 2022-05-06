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

app.get("/", (req, res, next) => {
  res.render("homepage");
});

app.get("/artist-search", (req, res, next) => {
  const { artistSearch } = req.query; // o que recebemos do front end d oform

  spotifyApi
    .searchArtists(artistSearch)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      res.render("artist-search-results.hbs", {
        artist: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;

  spotifyApi.getArtistAlbums(artistId).then(
    function (data) {
      console.log("Artist albums", data.body);
      res.render("albums", { album: data.body.items });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/tracks/:albumId", (req, res, next) => {
  const { albumId } = req.params; //params usamos qd ha mais a frente
  spotifyApi.getAlbumTracks(albumId).then(
    function (data) {
      console.log(data.body.items); // testar na consola p ver onde estamos// abrir passo a passo para testar e encontrar o caminho no back end
      res.render("tracks", { track: data.body.items }); // o que pomos para verem no front end
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
