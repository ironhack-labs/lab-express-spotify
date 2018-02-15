var SpotifyWebApi = require('spotify-web-api-node');
const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');

app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Remember to paste here your credentials
var clientId = '97b4cf63bc46465c8869fecad8d25334',
    clientSecret = '452ffacfc5334eb989635d9abbf8d125';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});


app.post("/artists",function(req, res){

 var searchArtist = req.body.search;

 spotifyApi.searchArtists(searchArtist)
  .then(function(data) {
   console.log(data.body.artists)
     res.render("artists", {
       artists: data.body.artists.items
     });
   }, function(err) {
     console.log(err);
   });



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");



// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.listen(3000, function(err){
  if(err) console.log(err);
  console.log("Tu servidor está funcionando en el puerto 3000");

});