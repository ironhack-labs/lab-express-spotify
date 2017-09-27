const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const prettyjson = require('prettyjson');
const util = require('util');

const app = express();

app.set('views', __dirname + '/views/layouts');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Remember to paste here your credentials
var clientId = '81205fac1d994094945f33e7ac9c3475',
    clientSecret = '2089f38dd3c14c1a8aab2387259af18f';

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

app.get("/", (req, res) => {
  res.render('index');
});

app.get("/artists", (req, res) => {
  let artistName = req.query.artistName;
  spotifyApi.searchArtists(artistName)
  .then((artistsRes) => {
    const artistsInfo = artistsRes.body.artists.items;
    console.log(artistsInfo);
    res.render('artists', {
      artistsInfo // ici on peut utiliser util.inspect, qui transforme en chaine de caracteres, inclut dans node de base (required en l:6)
    });
  }).catch((err) => {
    console.log(err);
  });
});

app.get('/albums/:id', (req, res) => {
  let artistid = req.params.id;
  spotifyApi.getArtistAlbums(artistid)
  .then((albumsRes) => {
    console.log(albumsRes.body);
    const albumsList = albumsRes.body.items;
    res.render('albums', {
      albumsList
    });
  }).catch((err) => {
    console.log(err);
  });
});

app.get('/tracks/:id', (req, res) => {
  let albumid = req.params.id;
  spotifyApi.getAlbumTracks(albumid)
  .then((tracksRes) => {
    console.log(tracksRes.body);
    const tracksList = tracksRes.body.items;
    res.render('tracks', {
      tracksList
    });
  }).catch((err) => {
    console.log(err);
  });
});




app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
