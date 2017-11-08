var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const layouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan')

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Remember to paste here your credentials
var clientId = 'feb5a3d8e5c44c3eb9385af27957ed7e',
    clientSecret = '9abea20606fa4fc9b4c5a45c4e0d8a38';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


app.get('/', (req, res, next) => {
  res.render('index', {
 });
});

app.get('/artists', (req, res, next) => {
  let artist = req.query.artist;
  spotifyApi.searchArtists(artist)
  .then(function(data) {
    res.render('artists', {
      artists: data.body.artists.items
   });

  }, function(err) {
    console.error(err);
});

app.get('/artist/:id', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.id)
  .then(function(data) {
    let artistAlbums = data.body.items;
    console.log(artistAlbums);
    res.render('artist', {
      album: artistAlbums});
  }, function(err) {
    console.error(err);
  });
})





});





// Retrieve an access token.

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
