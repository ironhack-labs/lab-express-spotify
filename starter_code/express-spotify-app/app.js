'use strict';

const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const path = require('path');

// create app
const app = express();

// -- setup the app
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));

// configure middlewares (static, session, cookies, body, ...)
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log('REQUEST:', req.method, req.path);
  next();
});
hbs.registerPartials(path.join(__dirname, '/views/partials'));

// SPOTIFY setup
// Remember to paste here your credentials
const clientId = '09d4125dfb8e4fcb89ec7c78680cd7b4',
  clientSecret = 'a76014f15bcc43299154e48b9292435e';

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

app.get('/', (req, res, next) => {
  res.render('home-page');
});

// search artist
app.get('/artists',(req, res, next) => {
  const artist = req.query.artist;
  spotifyApi.searchArtists(artist)
  .then(result=> {
    const data = {
      artist: result.body.artists.items
    };
    // console.log(data.artist[0].images[0].url);
    res.render('artists', data);
  })
  .catch(err => {
    console.log(err);
  });
});

// see albums from selected artist
app.get('/albums/:artistId', (req, res, next) => {
  const artistId = req.params.artistId;
  //console.log(artistId);
  spotifyApi.getArtistAlbums(artistId)
    .then(result => {
      const data = {
        album: result.body.items
      };
      //console.log(data.album[0].name);
      res.render('albums', data);
    })
    .catch(err => {
      console.log(err);
    });

});

// Get tracks in an album
app.get('/album/:id', (req, res, next) => {
  const albumId = req.params.id;
  console.log(albumId);
  spotifyApi.getAlbumTracks(albumId, /**{ limit: 5, offset: 1 }*/)
    .then(result => {
      const data = {
        track: result.body.items
      };
      res.render('tracks', data)
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(3000, () => console.log('hello, connected to 3000'));