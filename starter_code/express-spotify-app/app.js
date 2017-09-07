/*jshint esversion: 6 */

const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layouts');

app.use(expressLayouts);
app.use(express.static('./public'));


// Remember to paste here your credentials
const clientId = '65d2f24f139f4ea68ccb40aea7a76c07',
    clientSecret = '44ff32748f8442849ed158c1bbec1c76';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body.access_token);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


app.get('/', (request, response, next) => {
  response.render('index');
});


app.get('/artists', (request, response, next) => {
  spotifyApi.searchArtists(request.query.artists)
  .then(function(data) {
    let artists = {
      artists: data.body.artists.items,
    };
    response.render('artists', artists);
  }, function(err) {
    console.error(err);
  });
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
    let albums = {
      albums: data.body.items
    };
    res.render('albums', albums);
  }, function(err) {
    console.error(err);
  });
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(function(data) {
    let tracks = {
      tracks: data.body.items
    };
    res.render('tracks', tracks);
  }, function(err) {
    console.error(err);
  });
});

app.listen(3000, () => console.log('running'));
