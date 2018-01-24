const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const SpotifyWebApi = require('spotify-web-api-node');
// Remember to paste here your credentials
const clientId = 'c9a00f8f4492411e99c79489198f9e9c',
  clientSecret = '4d73f90e470040febb3540068471f765';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('ok')
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.get('/', (req, res, next) => {
  res.render('index');
});

app.post('/artists', (req, res, next) => {
  const searchArtist = req.body.artist;
  spotifyApi.searchArtists(searchArtist).then((response) => {
    const artists = response.body.artists.items;
    res.render('artists', { artists, searchArtist });
  }).catch(function (err) {
    console.log(err);
  });
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then((response) => {
    const albums = response.body.items;
    res.render('albums', { albums });
  }).catch(function (err) {
    console.log(err);
  });
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId).then((response) => {
    const tracks = response.body.items
    res.render('tracks', { tracks });
    }).catch(function (err) {
      console.log(err);
    });
});

app.listen(3000);
