require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Iteración 1 | Configuración de la API de Spotify

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

// Paso 1 | Crear una página de inicio
app.get("/", (req, res, next) => {
    res.render("home");
  });

  // Paso 2 | Mostrar resultados para la búsqueda de artistas

  app.get("/artist-search", (req, res) => {
  const artist = req.query.artists
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
        console.log(data.body.artists)
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});


  
app.get("/albums/:artistId", (req, res) => {
    const artistId = req.params.artistId;
    console.log("artistId:", artistId);
    spotifyApi
      .getArtistAlbums(artistId)
      .then((data) => {
        const albums = data.body.items;
        res.render("albums", { albums });
      })
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      );
  });

  app.get("/tracks/:trackId", (req, res) => {
    const trackId = req.params.trackId;
    console.log("trackID", trackId);
  
    spotifyApi.getAlbumTracks(trackId).then((data) => {
      const tracks = data.body.items;
      console.log("these are the tracks:", tracks);
      res.render("tracks", { tracks });
    });
  });


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
