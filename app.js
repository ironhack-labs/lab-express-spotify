require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const path = require("path");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

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

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  console.log(req.query.artist);
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log("Los datos recibidos de la API:", data.body);
      // ----> 'AQUÍ LO QUE QUEREMOS HACER DESPUÉS DE RECIBIR LOS DATOS DE LA API'
      res.render("artist-list-result", { data: data.body.artists.items });
    })
    .catch((err) =>
      console.log("Se produjo el error al buscar artistas:", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data =>{
      res.render("albums",{data: data.body.items})
  })
  .catch(err => console.log("The error while searching artist ocurred: ",err));
});

app.get("/tracks/:albumsId", (req, res, next) => {
    spotifyApi
    .getAlbumTracks(req.params.albumsId)
    .then(data =>{
        res.render("tracks",{data: data.body.items})
    })
    .catch(err => console.log("The error while searching artist ocurred: ",err));
  });


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
