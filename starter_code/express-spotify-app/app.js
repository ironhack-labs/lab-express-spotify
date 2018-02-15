const express        = require('express');
const bodyParser     = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
var SpotifyWebApi    = require('spotify-web-api-node');

const app = express();

app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Remember to paste here your credentials
var clientId = '37077a2319e3459092f50b8bda0e09d3',
    clientSecret = '2512ed979a424b9cb72684c01e738ea4';

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

app.get(`/`, (req, res, next) => {
  res.render("landing");
})

app.post(`/artists`, (req, res, next) => {
  spotifyApi.searchArtists(req.body.artist)
  .then(function(data) {
    res.render("artists", {data})
  }, function(err) {
    console.error(err);
  });
})

app.get('/albums/:artistId', (req, res) => {
  // console.log(artistId)
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
    res.render('albums', {data});
  }, function(err) {
    console.error(err);
  });
});

app.get('/tracks/:albumId', (req, res) => {
  // console.log(artistId)
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(function(data) {
    console.log(data.body.items[0].name, data.body.items[0].preview_url);
    res.render("tracks", {data});
  }, function(err) {
    console.error(err);
  });
});

app.listen(3000, () => {
  console.log(`Spotify app listening on port 3000!`);
})