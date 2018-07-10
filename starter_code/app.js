'use strict'

const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const prettyjson = require('prettyjson');
const path = require('path');

const SpotifyWebApi = require('spotify-web-api-node');

const clientId = '8d628f5b061f45409cdde686279f85a2';
const clientSecret = '5a46fa3876d84df1be1a32cff68aaf8b';

app.set('views', path.join(__dirname, 'views/layouts'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + '/views/partials');

app.use(bodyParser.urlencoded({ extended: true }));

const spotifyApi = new SpotifyWebApi({
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

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  // console.log(req.query);

  spotifyApi.searchArtists(req.query.artist)
  .then((data) => {
    console.log(data.body.artists.items[0].images)
    res.render('artists', {artists: data.body.artists.items})
  })
  .catch(err => {
    console.log(err);
  })
  ;

});   

app.get('/albums/:artistId', (req, res, next) => {

  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    console.log(data);
    res.render('albums', {albums: data.body.items})
  })
  
});   

app.listen(3000, () => console.log('Example app listening on port 3000!'));