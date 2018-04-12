var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path')
//const expressLayouts     = require('express-ejs-layouts');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname,"public")));

// Remember to paste here your credentials
var clientId = '7c41f400b36a4b65903dda063f67cb0d',
    clientSecret = '40b8383f96c449468bf52fdd78495c01';

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

//Home Page
app.get('/', (req, res, next) => {
  res.render('home');
});


//Artist page
app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
    console.log(data.body.artists.items);
    res.render('artists',{artist:data.body.artists.items});
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })



  
  
});

app.listen(3001,()=> console.log("Testing..."));