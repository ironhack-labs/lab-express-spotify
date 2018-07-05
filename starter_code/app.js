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
  res.render('index')
});

app.post('/artists', function (req, res, next) {
  let artistName = req.body.artist;

  console.log(req.body)


  
  spotifyApi.searchArtists(artistName)
  .then(function(data) {
    console.log(data.body.artists.items[0].name);
    console.log(data.body.artists.items[0].images[0].url);
    // console.log(data.body.artists.items[0].albums);
    res.send(`Artist Name: ${data.body.artists.items[0].name}, 
      Image: ${data.body.artists.items[0].images[0].url}`);



  }, function(err) {
    console.error(err);
  });



})    

app.listen(3000, () => console.log('Example app listening on port 3000!'));