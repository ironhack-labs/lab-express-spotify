const express = require('express');
const app = express();
const hbs = require('hbs');
const path    = require('path');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.render('index');

});

app.get('/artist', (req, res, next) => {
  console.log(req.query.artist);
  const searchArtist = req.query.artist;
  spotifyApi.searchArtists(searchArtist)
    .then(result => {
      const data={
        artists: result.body.artists.items
      }
      res.render('artist', data);
    })
    .catch(next)

});


app.get('/albums', (req, res, next) => {
  res.render('albums');

});


var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'deb9ec3881bc447b9baeb9d0f6d9f2f0',
    clientSecret = 'd732b5813af74b3080636e2cbe027334';

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


app.listen(3000);