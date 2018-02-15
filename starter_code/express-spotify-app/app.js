var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.set("layout", 'layouts/main-layout');

// Remember to paste here your credentials
var clientId = '8dd89d9e516d49d3888ddda732e85bfc',
    clientSecret = '9413dd598c4e47ad9710dc522bde326b';

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

app.get("/", (req,res,next)=>{
  res.render("home");
  next();
});

app.post("/artists", (req,res,next)=>{
  spotifyApi.searchArtists(req.body.artist).then((response) =>{
    res.render("artists", {artistFounded: response.body.artists.items, artistSearch: req.body.artist})
  }).catch((err) => {
    console.log(err);
  })
})

app.get('/albums/:artistId', (req,res,next) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then((response)=>{
    let artistName = response.body.items[0].artists[0].name
    let albumName = response.body.items
    let albumImage = response.body.items
    res.render("albums", {artistName,albumName,albumImage})
  })
});

app.get('/tracks/:albumId', (req,res,next) => {
  spotifyApi.getAlbumTracks(req.params.albumId).then((response)=>{
    let track = response.body.items
    res.render("tracks", {track});
  })
});

app.listen(3000, function(err){
  if(err) console.log(err);
  console.log("Tu servidor web está funcionando en el puerto 3000")
});