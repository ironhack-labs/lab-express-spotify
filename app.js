//Client ID 0571799171fc415f8560e49d22fce482
//Client Secret f08781ac1d464b84a2a6a0197b6815a3 
const express = require('express');
const app = express();
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const path = require('path');
const bodyParser = require('body-parser');

// Remember to paste here your credentials
var clientId = '0571799171fc415f8560e49d22fce482',
    clientSecret = 'f08781ac1d464b84a2a6a0197b6815a3',
    accessToken = "";

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

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.get('/',(req,res,next) => {
    res.render('index');
});

app.post('/artists', (req, res, next) => {
  const artist = req.body.artist;

  spotifyApi.searchArtists(artist)
    .then((data) => {
      artistArray = data.body.artists.items;
      res.render('artists', { artistArray });
    })
    .catch((err) => {
      console.log('Error artists: ', err);
    });
});

app.get('/albums/:artistID', (req, res, next) => {
  const artist = req.params.artistID;

  spotifyApi.getArtistAlbums(artist)
    .then((data) => {
      albumArray = data.body.items;
      res.render('albums', { albumArray });
    })
    .catch((err) => {
      console.log('err', err);
    });
});

app.get('/tracks/:albumID', (req, res, next) => {
  const album = req.params.albumID;

  spotifyApi.getAlbumTracks(album)
    .then((data) => {
      trackArray = data.body.items;
      res.render('tracks', { trackArray });
    })
    .catch((err) => {
      console.log('Error tracks:', err);
    });
});

app.listen(3000);
