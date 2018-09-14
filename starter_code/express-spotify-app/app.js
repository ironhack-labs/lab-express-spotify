const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require ('path')




app.set('view engine', 'hbs');
app.set('views', __dirname + '/views/layouts');
app.use(express.static(path.join(__dirname, 'public')));

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '66170b6cba0a4a90ac5f9e26f904d5e0',
    clientSecret = 'edbf14e86d40432789f5861aeea415ce';

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

app.get('/artistas', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render('artists', {artists: data.body.artists.items});
    })
    .catch(err => {
      console.log('Error!!', err);
    })
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      res.render('albums', {albums: data.body.items});
    })
    .catch(err => {
      console.log('Error!!', err);
    })
});

app.listen(3000, () => console.log('Servidor listo y trabajando para tu Spotify!!!'));