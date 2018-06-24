const express = require("express");
const app = express();
const hbs = require('hbs');
const bodyParser = require("body-parser")

app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials/")

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '3e2a5266ca974a5f9991fed3c5302996',
    clientSecret = '7bdf6f96250a4d53989c2902da0926b4';

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

//Routes
//--------------------------------------------
app.get("/", (req, res, next) => {
  res.render("index.hbs")
});

app.get("/artists", (req, res, next) => {

  spotifyApi.searchArtists(req.query.search_query)
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.locals.artistsResults = data.body.artists.items
      res.render("artists.hbs")
      // res.send(data)
    })
    .catch(err => {
      console.log("artist search failed", err);
    })
});


app.get("/albums/:artistId", (req, res, next) => {

  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      res.locals.albumResults = data.body.items;
      res.render("albums.hbs")
      // res.send(data.body.items)
    })
    .catch(err => {
      console.log("View albums failed", err)
    });
});

app.get("/tracks/:albumId", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(data => {
    res.locals.trackResults = data.body.items;
    res.render("tracks.hbs")
    // res.send(data.body.items)
  })
  .catch(err => {
    console.log("View tracks failed", err)
  })
})


app.listen(3000, () => {
  console.log("Connected!");
});
