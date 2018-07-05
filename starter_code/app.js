const express = require('express');
const path = require('path');
const morgan = require('morgan');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express(); // Express App

// Setters
var clientId = '0dd854742504467c8e9ea8a20a2fd2c1',
    clientSecret = 'e5e69f7b453e4665bbcd41a51027973c';

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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

//MiddleWare
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('index.hbs');
});

app.get('/artist', (req, res) =>{
  var artist = req.param('artist')

  spotifyApi.searchArtists(artist)
  .then((data) => {
      console.log(`Search artists by ${artist}`);
      
      let artistArr = data.body.artists.items;
      res.render('artists', {artistArr, artist});
  })
  .catch((err) => {
      console.error(err);
  })
});

app.get('/albums/:artistId', (req, res) => {
  var artistId = req.params.artistId;
  
  spotifyApi.getArtistAlbums(artistId)
  .then((data) => {
    let albumArr = data.body.items;
    res.render('albums', {albumArr});
  })
  .catch((err) => {
    console.error(err);
  })
});

app.get('/songs/:albumId', (req, res) => {
  var albumId = req.params.albumId;

  spotifyApi.getAlbumTracks(albumId)
  .then(function(data) {
    let songsArr = data.body.items;
    console.log(songsArr)
    res.render('songs', {songsArr});
  }, function(err) {
    console.log('Something went wrong!', err);
  });

});

// Init server
app.listen(3000, () => console.log("Hola Gabi, mi servidor te escucha!"));