let SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', __dirname + '/views/layouts/main');

app.use(bodyParser.urlencoded({ extended: true}));

app.use(morgan('dev'));

app.use(express.static('public'));

// Credentials
let clientId = 'dc0f47ec63264d79aff506198b01588f',
    clientSecret = '4bc6682d4b784c35835e1bd17b4430a8';

let spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.get('/', (request, response) => {
  response.render('homepage');
});

app.get('/artists', (request, response) => {
  let searched = request.query.artist;
  spotifyApi.searchArtists(searched)
  .then(function(data) {
    let found = (data.body.artists.items);
    response.render('artists', {artist: found});
  }, function(err) {
    console.error(err);
  });
});

app.get('/artists/:id', (request, response) => {
  let searched = request.params.id;
  spotifyApi.getArtistAlbums(searched)
  .then(function(data) {
    let found = data.body.items;
    response.render('albums', {album: found});
  }, function(err) {
    console.error(err);
  });
});

app.get('/albums/:id', (request, response) => {
  let searched = request.params.id;
  spotifyApi.getAlbumTracks(searched)
  .then(function(data) {
    console.log(data.body.items);
    let found = data.body.items;
    response.render('tracks', {tracks: found});
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.listen(27000);
