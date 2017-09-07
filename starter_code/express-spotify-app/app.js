const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

const app = express();
app.use(expressLayouts);
app.set('layout', 'layout');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '433c068423264b318b1a5e78ae7cf873',
    clientSecret = '772b76eccdf647929d017d04efd07e6e';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log("Im ok");
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});
let myArtists;
let myQuery;
app.get("/",(req, res) =>{
  res.render('index');
});
app.post("/artists",(req, res) =>{
  spotifyApi.searchArtists(req.body.artist)
  .then((response) =>{
    myArtists = response.body.artists;
      res.redirect('/artists');
  }).catch((err)=>{
    console.log(err);
  });

});
app.get("/artists",(req, res) =>{
  res.render('artists', {check: myArtists});
});
app.get("/albums/:artistId",(req,res)=>{
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then((response)=>{
    res.render('albums',{myAlbums : response.body.items });
  }).catch((err)=>{
    console.log(err);
  });
});
app.get('/tracks/:albumId',(req, res)=>{
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then((response)=>{
    res.render('tracks', {myTracks: response.body.items});
  }).catch((err)=>{
    console.log(err);
  });
});

let port = 3000;
app.listen(port, () => {
  console.log(`My first app listening on port ${port}!`);
});
