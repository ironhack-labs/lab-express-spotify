require("dotenv").config();

const express = require("express");
const pug = require("pug");
// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");
const app = express();
console.log("WTF");
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "public"));
app.use(bodyParser.urlencoded({ extended: true }));
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

console.log("1::");
// the routes go here:
app.post("/buscar", (req, res) => {
  let { name } = req.body;
  spotifyApi
    .searchArtists(name)
    .then(data => {
      console.log("Artistas enconrados:", data.body.artists.items);
      let artistas = [];
      data.body.artists.items.forEach(artista => {
        let { name, id, images } = artista;
        //console.log(name, id, images[0].url);
        let imgurl = "";
        if (images) if (images[0]) imgurl = images[0].url;
        artistas.push({
          name,
          id,
          imgurl
        });
      });
      console.log("Una muestra ", artistas);
      res.render("buscar", { artistas });
    })
    .catch(err => {
      console.log("No se encontro nada", err);
      res.render("buscar", { encontro: false });
    });
  console.log(name);
});

app.get("/albumes/:id", (req, res) => {
  //sacar información del artista a
  //partir de un input con forma de boton. input type="button" name="artista"
  let { id } = req.params;
  spotifyApi
    .getArtistAlbums(id)
    .then(albumes => {
      let artistname = albumes.body.items[0].artists[0].name;
      console.log(albumes.body.items[0].artists[0].name);
      console.log(albumes.body.items);
      res.render("albumes", { albumes: albumes.body.items, artistname });
    })
    .catch(error => {
      res.redirect("/");
    });
});

app.get("/", (req, res) => {
  res.render("index", { encontro: true });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
