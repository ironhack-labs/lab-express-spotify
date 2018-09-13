const express = require('express');
const app = express();
const hbs = require('hbs');
const path    = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '4d0b285637214693a59ba1eb8ae06b26';
const clientSecret = '9545b980b0544ef99bc0def2338fd8c4';
const spotifyApi = new SpotifyWebApi({clientId : clientId, clientSecret : clientSecret});

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(path.join(__dirname, 'public')));

spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, (err) => {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res, next) => {
  res.render('index')
});

app.get('/artists', (req, res, next) => {
  let artist = req.query.artist
  spotifyApi.searchArtists(artist)
    .then(data => {
      
      res.send(data);
      // res.render('index')
    })
    .catch(err => {
      console.log(err);
    })
});




app.listen('3000')