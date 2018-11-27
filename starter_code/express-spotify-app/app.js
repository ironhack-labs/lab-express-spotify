const express = require('express');
const app = express();
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node');
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Remember to paste your credentials here
var clientId = '8378bd5b4d934462980eb5f23d57271d',
    clientSecret = 'f89ddb6a06a946e18e60f065e751ece3';

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

//___________________________ROUTES_________________________________________________________

hbs.registerPartials(__dirname + "/views/partials")

// Route Home
app.get("/", (req, res, next) => {
  res.render('index')
})

// Route Artists
app.get('/artists', function (req, res) {
  // récupère la data liée à un artist
  spotifyApi.searchArtists(req.query.artist)
  .then(data => {    
    console.log("super") 
    res.render("artists", {artists:data.body.artists.items});
  })
  .catch(err => {
    console.log("erreur") 
  })
})



//______________________________________________________________________________________________________

app.listen(3000);
