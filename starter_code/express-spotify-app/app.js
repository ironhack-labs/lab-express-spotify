var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + '/views/partials')

// Remember to paste here your credentials
var clientId = 'c9e6c6ff2abd4675b1ad938c30501d11',
  clientSecret = '746977b1e77240faa9d0d2411c3e0efe';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.get('/', (req, res, next) => {
  res.render('index');
});
//Interation 3
app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.searchArtists)
    .then(data => {
      let artists = data.body.artists.items
      res.render('artists', { artists });
    })
    .catcher(err => {
      console.log(error)
    })
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      let albums = data.body.items;
      res.render('albums', { albums });
    })
    .catch(err => {
      console.log(error)
    })
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      res.render('albums', { albums });
    })
    .catch(err => {
      console.log(error)
    })

});

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
      let tracks = data.body.items
      console.log(tracks)
      res.render('tracks', { tracks });
    })
    .catch(err => {
      console.log(error)
    })
});

app.listen(3000);