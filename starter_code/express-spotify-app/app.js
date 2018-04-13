const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.set('layout', __dirname + '/views/layout.hbs');


var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '5ed1a18edd4e44ea848e7fa7944b12fe',
    clientSecret = '843391fa7c6d4e0499a31bb2a319931b';

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

//home-page route
app.get('/', (req, res, next) => {
  res.render('home-page');
});

//artists route
app.get('/artists/', (req, res) => {
  let artistName = req.query.q;
  spotifyApi.searchArtists(artistName)
    .then((data) => {
      let arr = data.body.artists.items;
      res.render('artists', {arr});
      console.log("Yes");
    })
    .catch((err) => {
      console.log("ERROR", err);
    });
})

//albums route
app.get('/albums/:artistId', (req, res) => {
  // code
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then((data) => {
      let array = data.body.items;
      res.render('albums', {array} );
      console.log(data.body.items);
    })
    .catch((err) => {
      console.log("ERROR", err);
    });
});


// tracks route
app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(function(data) {
      let songs = data.body.items;
      res.render('tracks', {songs});
      console.log("Voila");
    })
    .catch((err) => {
      console.log('Something went wrong!', err);
    });
});


app.listen(3000, () => {
  console.log("App is running");
});