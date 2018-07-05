const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const bodyparser = require('body-parser')
const debug = require('debug')('spotify:app');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'e2bb27d6962c4bf8885bcac353a61027',
    clientSecret = '563076fb6e254c1689262bcfcc3432c2';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      console.log(data)
      res.render('artists', {data: data.body.artists.items});
    })
    .catch(error => {
        console.log(error)
      })
});

app.listen(3000, () => console.log("hi!"))