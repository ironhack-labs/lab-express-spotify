var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const layouts = require('express-ejs-layouts');
const bodyParser=require('body-parser');
const morgan = require('morgan')
const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public'));
app.set(layouts)
app.set('views', __dirname + '/views/layouts');
app.set('layout', __dirname + '/views/layouts/main');
app.set('view engine', 'ejs');


// Remember to paste here your credentials
var clientId = 'a94857369250400696b2e552be482256',
    clientSecret = '89f7ed4a57644f03a187c8c650b32102';

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
  res.render('search-form');
});

app.get('/artists', (req, res) => {
  let artistsSearch = req.query.artist;

  spotifyApi.searchArtists(artistsSearch)
  .then(function(data) {
    let artistsArray = data.body.artists.items;
    res.render('artists', {artists: artistsArray})
  }, function(err) {
    console.error(err);
  });
});

app.get('/artist/:id',(req,res)=>{
  let artistsId = req.params.id;
  spotifyApi.getArtistAlbums(artistsId)
  .then(function(data) {
  let artistsAlbums = data.body.items;
  res.render('albums', {albums: artistsAlbums});
}, function(err) {
  console.error(err);
});
});

app.get('/album/:id',(req,res)=>{
  let albumId = req.params.id;
  spotifyApi.getAlbumTracks(albumId)
  .then( data => {
    let allTracks = data.body.items;
  res.render('tracks', {tracks: allTracks});
}, err => {
  console.error(err);
});
});

// app.get('/albums/:artistId', (req, res) => {
//   spotifyApi.getArtistAlbums(req.query.artist)
//   .then(function(data) {
//     console.log(data.body.artists.items[0])
//     res.render('view-albums', {
//       artist: data.body.artists.items[0]
//     })
//   }, function(err) {
//     console.error(err);
//   })
// });

app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
