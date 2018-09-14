var SpotifyWebApi = require('spotify-web-api-node');
const express = require("express");
const app = express();
const hbs = require('hbs');
const path = require('path');

app.set('view engine', 'hbs');
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + '/public'));

var clientId = 'a7a0018529d64d0eafdd72cd9a4accd8',
  clientSecret = '93322567ef664f5190fed171ff812321';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });


app.get('/', (req, res) => {
  res.render("index");
});

app.get("/artists", function (req, res) {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      let artists = data.body.artists.items;
      console.log(artists)
      res.render("artists", {
        artists
      });
    })
    .catch(err => {
      console.log("esto es un error :)")
    });
});



app.listen(3000, () => {
  console.log("escuchando en el puerto 3000")
});