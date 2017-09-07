
var SpotifyWebApi = require('spotify-web-api-node');
var clientId = '2bb8357c009d414aa977da5341a6ac1a',
    clientSecret = 'ef0d1a3f23a14ef8a5cd4934493969cd';
var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body.access_token);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

const express         = require('express');
const app             = express();
const bodyParser      = require('body-parser');
const expressLayouts  = require('express-ejs-layouts');

app.use(express.static('public'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {
    res.render("index");
});


app.get('/artist', (req, res, next) => {
    let artist = req.query.artist;
    spotifyApi.searchArtists(artist).then((data) => {
      let artists = data.body.artists.items;
      res.render('artist', {artists});
    }, (err) => {
      console.log(err);
    });
});

app.get('/album/:artist', (req, res, next) => {
    let artist = req.params.artist;
    spotifyApi.getArtistAlbums(artist).then((data) => {
      let albums = data.body.items;
      res.render('album', {albums});
    }, (err) => {
      console.log(err);
    });
});

app.get('/tracks/:album', (req, res, next) => {
    let album = req.params.album;
    spotifyApi.getAlbumTracks(album).then((data) => {
      let tracks = data.body.items;
      console.log(tracks);
      res.render('tracks', {tracks});
    }, (err) => {
      console.log(err);
    });
});

app.listen(3000);
