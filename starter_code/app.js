var SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const bodyParser=require('body-parser');
const morgan = require('morgan')

app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.set(layouts)
app.set('layout', __dirname + '/views/layouts/main-layout');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var clientId = '02556150f0a544308afbd26367ab08ce', clientSecret = '975dd45e37884a6992731a7dfb2470f5';
var spotifyApi = new SpotifyWebApi({ clientId : clientId, clientSecret : clientSecret });

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res) => {
  res.render('index')
});

app.get('/artists', (req, res) => {
  let artistQuery = req.query.artist;
  spotifyApi.searchArtists(artistQuery)
  .then(function(data) {
    console.log(artistQuery);
    res.render('artists', { artist: data.body.artists.items[0]});
  }, function(err) {
    console.error(err);
  });
});

app.get('/albums/:artistId', (req, res) => {
  let albumsQuery = req.params.artistId;
  spotifyApi.getArtistAlbums(albumsQuery)
  .then(data => {
    console.log('Artist albums', data.body.items)
    res.render('albums', {
      albums: data.body.items,
      totalAlbums: data.body.total
    });
  }, function(err) {
    console.error(err)
  });
});

app.get('/tracks/:albumId', (req, res) => {
  let tracksQuery = req.params.albumId
  spotifyApi.getAlbumTracks(tracksQuery)
  .then(function(data) {
    console.log(data.body.items);
    res.render('tracks', {
      tracks: data.body.items,
    })
  }, function(err) {
    console.log(err);
  });
})
app.listen(3000, () => {
  console.log('Spotify app listening on port 3000!');
});
