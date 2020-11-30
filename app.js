require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// spoty api require
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

// Recupera un token de acceso
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// las rutas van aqui:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log('datos respuesta:', data.body.artists)
      var itemsArtist = data.body.artists.items;
      // console.log("Los items son:", itemsArtist);

      res.render("artist-search-results", { itemsArtist }); // renderizamos cuando obtenemos los datos de la api, ni antes ni despues
      // ----> 'AQUÍ LO QUE QUEREMOS HACER DESPUÉS DE RECIBIR LOS DATOS DE LA API'
    })
    .catch((err) => {
      console.log("El error al buscar artistas ocurrió:", err);
      res.render("error"); 
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  //.getArtistAlbums() code goes here
  var artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      console.log("Artist albums", data.body);
      var itemAlbum = data.body.items;
      //console.log(itemAlbum[0].images);
      res.render("albums", { itemAlbum });
    })
    .catch((err) => {
      console.log("El error al buscar artistas ocurrió:", err);
      res.render("error"); 
    });
});

app.get('/tracks/:id', (req, res) => {
  var artistId = req.params.artistId;
  const { id } = req.params;
  spotifyApi.getAlbumTracks(id)
      .then(data => {
          const info = data.body.items
          res.render("tracks", {info})
      }
  )
})



app.listen(4000, () =>
  console.log("My Spotify project running on port 4000 🎧 🥁 🎸 🔊")
);
//3BHe7LbW5yRjyqXNJ3A6mW