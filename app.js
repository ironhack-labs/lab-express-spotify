
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const PORT = 3000;
const bodyParser = require('body-parser');



app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.get('/', (req, res, next) => {
  res.render('index');
})

app.get('/artists', (req, res, next) => {
  const { artist } = req.query;

  spotifyApi.searchArtists(artist)
    .then(data => {
      const items = data.body.artists.items;

      res.render('artists', { items });
    })
    .catch(err => {
      console.error(err);
    })
})

app.get('/artists/:artistId', (req, res) => {
  const artistId = req.params.artistId;

  spotifyApi.getArtistAlbums(artistId).then(
    function (data) {
      const albums = data.body.items;
      res.render('albums', { albums });
    },
    function (err) {
      console.error(err);
    });
});

app.get('/albums/:albumId', (req, res) => {
  const trackId = req.params.albumId;

  spotifyApi.getAlbumTracks(trackId, { limit: 5, offset: 0 })
    .then(function (data) {
      const tracks = data.body.items;

      res.render('tracks', { tracks })
    }, function (err) {
      console.log('Something went wrong!', err);
    });
})

// Remember to paste your credentials here
const clientId = '6ecd13a70a3249bca3d8fb2726baa',
  clientSecret = '';

const spotifyApi = new SpotifyWebApi({
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

app.listen(PORT, () => {
})
