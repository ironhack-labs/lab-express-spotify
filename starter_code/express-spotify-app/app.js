var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path')
const bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');


// Remember to paste here your credentials
var clientId = '59961a8be82746779b22d83a172171f0',
    clientSecret = '0918dc3d3e4d4bfbbbd26e26f93300b0';

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
   res.render('index');
});

app.get ('/artists', (req, res) => {
  let artists = req.query.artist;
  spotifyApi.searchArtists(artists)
    .then(data => {
      res.render('artists', {artists, data})
    })
    .catch(err => console.error(err));
});

app.get('/albums/:artistId', (req, res) => {
  let artID = req.params.artistId;
  spotifyApi.getArtistAlbums(artID)
  .then(data => {
    res.render('albums', {artID, data})
  })
})


app.listen(3000, () => console.log('Example app listening on port 3000!')); 





