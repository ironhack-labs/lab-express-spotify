const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
const morgan = require('morgan');

let clientId = 'ba31ef4be86043cd922c143e76a1a6e2';
let clientSecret = 'dfb944fbbb5e48a7bf5ae5c9a121c86d';

let spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + '/views/partials')

app.get('/', (req, res, next) => {
  res.render('index');
  let {
    artist
  } = req.query
  // console.log(req.query);
});

app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      artist = data.body.artists.items;

      res.render('artists',{artist});
    })
    .catch(err => {
      console.log("An error has ocurred while searching for artist: ", err)
    })
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
      album = data.body.items
      console.log(album)
      res.render('albums', {album})
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(function(data) {
      tracks = data.body.items
      res.render('tracks', {tracks})
    },
    function(err) {
      console.error(err);
    }
  );
});



app.listen(3000, () => {
  console.log('Port 3000')
});