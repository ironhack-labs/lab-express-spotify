const express = require('express');
const path = require('path');
const hbs = require('hbs');
const app = express();
//const fs = require('fs');
//const bodyParser = require('body-parser');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + "/views/partials");


var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = '6ec696df61634d928e76fc44cc12ffeb',
    clientSecret = '74e2c61bdc0b40559fb319cc06763f61';

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



app.get('/', function (req, res) {
    res.render('home')
  })
  

app.get("/artist", (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      const artist = data.body.artists.items;
      res.render("artist", { artist });
    })
    .catch(err => {
      console.log("error", err);
    });
});


app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
      album = data.body.items
      res.render('albums', { album });
    })
  .catch(err => {
      console.log(err);
    });
});


app.get('/tracks/:artistId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.artistId)
  .then(function(data) {
      tracks = data.body.items
      res.render('tracks', { tracks });
    })
  .catch(err => {
      console.log(err);
    });
});


app.listen(3000, () => console.log('Example app listening on port 3000!'))
