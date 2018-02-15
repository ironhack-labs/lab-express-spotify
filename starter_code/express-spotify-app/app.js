//para tener un servidor express
//1-. importacion de la libreria
var SpotifyWebApi = require('spotify-web-api-node');
//2-. instancia de express
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require("body-parser");


//body parser
app.use(bodyParser.urlencoded({extendes: true}))
//es para que pueda leer los archivos de la carpeta public
app.use(express.static("public"))
app.use(expressLayouts)
app.set('layout', 'layouts/main-layout')
//indicamos el motor de vistas
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("home");
});




// Remember to paste here your credentials
var clientId = 'fa967eff37de4e2db29c46617ffd5c5e',
    clientSecret = '0c3432f372694b8eb477d5d7902848c0';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

//artist

 app.post('/artists',function(req, res){
  var searchArtist = req.body.search

  spotifyApi.searchArtists(searchArtist)
   .then(function(data) {
     console.log(data.body.artists)
      res.render('artists', {
        artists: data.body.artists.items
      });
    }, function(err) {
      console.log('error', err);
    });

 });
// siempre va al final, es lo que escucha
app.listen(3000, function(err){
  if(err) console.log(err);
  console.log("Tu servidor está funcionando")
})
