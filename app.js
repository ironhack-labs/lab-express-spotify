require("dotenv").config();

const e = require("express");
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
    const { artist } = req.query;
    let searchAllArtist = await spotifyApi.searchArtists(artist);
    const artistFound = searchAllArtist.body.artists.items;

    /* console.log(artistFound); */
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render("artists-search", { artistFound });
  } catch (error) {
    console.log("The error while searching artists occurred: ", error);
  }
});

app.get("/albuns/:artistId", async (req, res, next) => {
  // ask why "/:artistId" instead of "id" like in hbs
  try {
    const { artistId } = req.params; // Descontrução de objectos, neste caso identificação do artista, para seleção específica
    let albunsInfo = await spotifyApi.getArtistAlbums(artistId);
    console.log(albunsInfo.body);
    const albunsFound = albunsInfo.body.items;
    res.render("albuns", { albunsFound });
  } catch (error) {
    console.log("The error while searching artists occurred: ", error);
  }
});

app.get("/tracks/:albunsId", async (req, res, next /* why next? */) => {
  try {
    const { albunsId } = req.params; // Aquando da pesquisa pega nos objetos "albuns" e devolve os parametros albunId - o que nos leva às tracks
    let tracksInfo = await spotifyApi.getAlbumTracks(albunsId); // get track for each album
    const tracksFound = tracksInfo.body.items;
    res.render("tracks", { tracksFound });
  } catch (error) {
    console.log("The error while searching artists occurred: ", error);
  }
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
