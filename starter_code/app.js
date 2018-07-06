const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');

// Remember to paste here your credentials
var clientId = 'a3250596712c4913864bbcfa74fbef04',
  clientSecret = 'beeb2ef843f742fb82150fe58cc0e8d7';

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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan('dev'));
app.use(express.static('public'));


app.get('/', (req, res) => {
  res.render('index.hbs');
});

app.get('/artist', (req, res) => {
  var artist = req.param('artist')

  spotifyApi.searchArtists(artist)
    .then((data) => {
      console.log(`Search artists by ${artist}`);

      let artistArr = data.body.artists.items;
      res.render('artists', {
        artistArr,
        artist
      });
    })
    .catch((err) => {
      console.error(err);
    })
});

app.get('/albums/:artistId', (req, res) => {
  var artistId = req.params.artistId;

  spotifyApi.getArtistAlbums(artistId)
    .then((data) => {
      let albumArr = data.body.items;
      res.render('albums', {
        albumArr
      });
    })
    .catch((err) => {
      console.error(err);
    })
});

app.get('/tracks/:albumId', (req, res) => {
  var albumId = req.params.albumId;

  spotifyApi.getAlbumTracks(albumId)
    .then(function (data) {
      let tracksArr = data.body.items;
      console.log(tracksArr)
      res.render('tracks', {
        tracksArr
      });
    }, function (err) {
      console.log('Error!', err);
    });

});

app.listen(3000, () => console.log("Listening"));