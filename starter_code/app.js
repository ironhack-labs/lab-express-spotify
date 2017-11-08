const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '22cd11a538084605865e90bf02b6b1a3',
    clientSecret = '3397fba7bc8d4045b0f063f17773d9cb';

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

app.get('/',(req,res)=>{
  res.render('index');
});

app.get('/artists',(req,res)=>{
  let artistSearch = req.query.artist;

  spotifyApi.searchArtists(artistSearch)
  .then(function(data) {
    let artistArray = data.body.artists.items;
    res.render('artists', {artists: artistArray});
  }, function(err) {
    console.error(err);
  });
});

//parametros, id
app.get('/artist/:id',(req,res)=>{
  let artistId = req.params.id;
      console.log("artista", artistId);
  spotifyApi.getArtistAlbums(artistId)
  .then(function(data) {
    let artistAlbums = data.body.items;
      console.log("artista album", artistAlbums);
      res.render('artist',{albums: artistAlbums});
  }, function(err) {
    console.error(err);
  });
});


app.listen(3010, () => {
  console.log('My first app listening on port 3000!');
});
