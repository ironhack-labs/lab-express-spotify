require("dotenv").config();

const express = require("express");

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

// middleware
app.use(express.json());

// Our routes go here:

app.listen(process.env.PORT, () =>
  console.log("My Spotify project running on port 4000 🎧 🥁 🎸 🔊")
);

// spotifyApi
// .seacrhArtists()

//busca por nome do artista, devolvendo o que encontrar
app.get("/", (req, res, next) => {
  spotifyApi.searchArtists("Arctic Monkeys").then((data) => {
    console.log(data.body);
    res.json(data);
  });
});

// busca por id do artista, devolvendo os álbuns desse artista

app.get("/artist/:id", (req, res, next) => {
  const { id: artistId } = req.params;
  // console.log(artistId);
  // res.json(req.params);

  spotifyApi.getArtistAlbums(artistId).then((data) => {
    console.log(data.body);
    res.status(200).json(data.body);
  });
});

// busca por id do álbum, devolvendo as faixas e o link da "amostra" da faixa tb (se não me engano nem toda música tem!)

app.get("/album/:id", (req, res, next) => {
  const { id: albumId } = req.params;

  spotifyApi.getAlbum(albumId).then((data) => {
    console.log(data.body);
    res.status(200).json(data.body);
  });
});

// BONUS: devolver essa lista das faixas ordenada pois ela vem numa ordem qualquer.

// spotifyApi
// .searchArtists()
