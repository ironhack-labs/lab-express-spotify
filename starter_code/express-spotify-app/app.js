var SpotifyWebApi = require('spotify-web-api-node');
// var BodyParser= require('body-parser');
var express= require('express');
var app = express();
var Ejs= require('ejs');
var Layouts= require('express-ejs-layouts');
var Morgan= require('morgan');
// Remember to paste here your credentials
var clientId = 'ef853ce61c9e42c4b5421ee1ebf6f468',
    clientSecret = 'f16f9e34875e4285914a04d5282e31fc';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.get('/', (req, res, next) => {
    res.render('index.ejs');
  });



// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

// app.get("/artist", (req, res, next) => {
//     client
//       .getRandomJoke()
//       .then(joke => {
//         let randomJoke = joke.value;
//         res.render("index", { name: randomJoke });
//       })
//       .catch(err => {
//       }
//       )})