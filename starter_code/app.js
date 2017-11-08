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
app.set('layout', __dirname + '/views/layouts/main-layout');
app.set('view engine', 'ejs');


// Remember to paste here your credentials
var clientId = '697d9cd1d47a471cb39b4b57d7ff6094',
    clientSecret = '3df96f7f1343416fafdae80f238accd2';

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

app.get('/', (req, res) => {
  res.render('search-form', {})
});

app.get('/artists', (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
  .then(function(data) {
    //console.log(data.body.artists.items[0])
    res.render('artist-info', {
      artist: data.body.artists.items[0]
    });
  }, function(err) {
    console.error(err);
  });
});

app.get('/albums/:artistId', (req, res) => {

  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    //console.log('Artist albums', data.body.items)
    res.render('view-albums', {
      albums: data.body.items,
      totalAlbums: data.body.total
    });
  }, function(err) {
    console.error(err)
  });
});

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(function(data) {
    //console.log(data.body.items);
    res.render('view-tracks', {
      tracks: data.body.items,
    })
  }, function(err) {
    console.log(err);
  });

})

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
