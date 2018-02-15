var SpotifyWebApi = require('spotify-web-api-node');
const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require ("body-parser");

app.use(express.static('public'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({extended:true}));
app.set('layout', 'layouts/main-layout')
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// Remember to paste here your credentials
const clientId = '799fc88736004b38b6fbf4a1e2615e75',
    clientSecret = 'b6313b41a5bc4e46b441dd75ffd1d238';

const spotifyApi = new SpotifyWebApi({
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

//routes

app.get('/',(req, res, next) => {
 res.render('home');
});

app.post('/artists',(req, res, next) => { 
  spotifyApi.searchArtists(req.body.name)
  .then( (data) => {
  const returnedArtists = data.body.artists.items
  res.render('artist', {artists: returnedArtists})
  })
});

app.get('/example',(req, res, next) => {
  res.render('example');
});













//mi puerto
app.listen(3000, function(err){
  if(err) console.log(err);
  console.log("Tu servidor está funcionando en el puerto 3000");
});