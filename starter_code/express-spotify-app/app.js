const express = require('express');
const app = express();
const hbs = require('hbs');
const body = require("body-parser");
const morgan = require("morgan");
const pretty = require("prettyjson")

app.use(express.static(__dirname + "public"));
app.set("view engine","hbs");
// hbs.registerPartials(__dirname + "/views/partials");

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials ===> OK
var clientId = '19c1d1f3ace74d3fae59257c08203435',
    clientSecret = 'f54d3d8cc46044d58099bf3a7e9edcc6';

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

app.get("/", (request,response,next) => {
  response.render("home-page.hbs");
});


//route artists
app.get("/artists", (request,response,next)=>{
  const { artist } = request.query;
  console.log(artist);
  spotifyApi.searchArtists(artist)
      .then(data => {
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        response.locals.searchArtist = data.body.artists.items;
        // console.log(data.body.artists.items);
        // response.send(data.body.artists.items) pour renvoyer sur le browser tous les elements
        response.render("artist-page.hbs");
      })
      .catch(err => {
        // ----> 'HERE WE CAPTURE THE ERROR'
        console.log('There is a Failure', err)
      })
});

app.get('/albums/:artistId', (request, response, next) => {
  const {artistId} = request.params;
  spotifyApi.getArtistAlbums(artistId)
    .then(albums => {
      response.locals.searchAlbums = albums.body.items;
      //console.log(albums.body.items[0]);
      //response.send(albums)
      response.render("album-page.hbs")
    })
    .catch(err => {
      console.log('There is a GROSSE Failure', err)
    })
  // code
});


app.listen(3000,() => {
  console.log("Now, we are in business");
});