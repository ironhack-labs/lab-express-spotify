const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require("body-parser");
const app = express();


app.set('layout', 'layout/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/index', (require, response, next) => {
  response.render('index');
});

app.post('/artists', (req,res) =>{
  let nameOfArtist = req.body.artist;
  spotifyApi.searchArtists(nameOfArtist)
  .then(function(data) {
    // console.log('Search artists by "Love"', data.body);
    res.render('artists',{
      nameOfArtist: nameOfArtist,
      artistItems: data.body.artists.items
    })
    // console.log(data.body.artists.items)
  }, function(err) {
    console.error(err);
    res.render('artists')
  });
})

app.get('/albums/:artistID',(req,res) =>{
     let artistID = req.params.artistID ;
  // console.log(artistID)
  spotifyApi.getArtistAlbums(req.params.artistID)
  .then(function(data) {
    res.render('albums',{
      artistAlbums: data.body.items
    })
    console.log(data.body.items);
  }, function(err) {
    console.error(err);
  });
})

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '87f6d727ea40438db933e56f97571f20',
    clientSecret = 'b075e97d5936419cb3d4e07911956ccb';

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


app.listen(3000, () => console.log("Ready!"));
