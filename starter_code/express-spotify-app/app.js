var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '1aeb28b4d404496d9ce0937112d74329',
    clientSecret = '6a2ef4050df34a93b457c729040ee6a7';

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

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', __dirname + '/views/layouts/main-layout');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use(express.static('public'));

app.get('/',(req,res)=>{
  console.log("GET / ");
  res.render('home');
});

app.get('/artists',(req,res)=>{
  spotifyApi.searchArtists(req.query.artist).then( function (data){
    res.render('artists',{result: data.body.artists.items});
  },function (err){
    console.log("Something went wrong!"+err);
  });
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then( function (data){
    res.render('albums',{result: data.body.items});
  },function (err){
    console.log("Something went wrong!"+err);
  });
});

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId).then( function (data){
    res.render('tracks',{result: data.body.items});
  },function (err){
    console.log("Something went wrong!"+err);
  });
});

app.listen(3004,()=>{
  console.log("Listening oon port 3004 OK");
});
