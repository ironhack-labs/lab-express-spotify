
const express = require('express');
const app = express();
const hbs = require("hbs")
const bodyParser = require("body-parser")// for accessing information in input fields in other files
var path = require("path")

app.use(express.static("public"))
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({
extended: true
}));

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
const config = require("./config");

var clientId = config.clientId
var clientSecret = config.clientSecret

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

app.get("/artists", function(req, res) {
    res.render("artists")
})

app.post("/artists", function(req, res){
    var searchArtist = req.body.artist
    
  spotifyApi.searchArtists(searchArtist)
  
    .then(function(data) {
        res.render("artists", {singer : data.body.artists.items})
      console.log('Artist information', data);
    }, function(err) {
      console.error(err);
    })
});


app.get("/artists/albums/:artistX", function (req, res){
   var artistAlbum = req.params.artistX
// debugger
  spotifyApi.getArtistAlbums(artistAlbum)

    .then(function(data) {
      // debugger
        res.render("albums", {album : data.body.items})
      },function(err) {
        console.error(err);
      })
  });

app.get("/artists/albums/tracks/:tracksX", function (req, res){
  var albumTracks = req.params.tracksX

spotifyApi.getAlbumTracks(albumTracks)

  .then(function(data) {
    // debugger
    res.render("tracks", {track : data.body.items})
  }, function(err) {
    console.log('Something went wrong!', err);
  })
});

app.listen(3000)
