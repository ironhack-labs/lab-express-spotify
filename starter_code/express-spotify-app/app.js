var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');

const publicDir = __dirname + "/public";
app.use(express.static(publicDir));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// Remember to paste here your credentials
var clientId = '26f938f14d504cfa91ca08be9a447c5c',
    clientSecret = '993c041ece634bf29eb5fb943df6a868';

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

app.get('/', (req, res, next) => {
  res.render('index');  
});

app.get('/artist', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
  .then(data => {
    const artist = data.body.artists.items
    console.log(artist)
    res.render('artist',{artist});
  })
  .catch(err => {
    console.log(err)
  })      
});

app.get('/album/:id', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.id)
  .then(data => {
    res.render('album',{data});
  })
  .catch(err => {
    console.log(err)
  })      
});

app.get('/songs/:idSongs', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.idSongs)
  .then(dataSongs => {
    res.render('songs',{dataSongs});
  })
  .catch(err => {
    console.log(err)
  })      
});

const  port= 3000;
app.listen(port,()=>{
  console.log(`Listen on port ${port}`)
});