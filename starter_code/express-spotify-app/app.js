'use strict'
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Remember to paste here your credentials
const clientId = 'de2a5776412c4406a6b35c5ddce85064',
  clientSecret = 'fe90faccd97a4e1bbb3a48a043ff281c';

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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
  res.render('index');
});

// app.get('/artists(:name', (req, res) => {
//   spotifyApi.searchArtists(req.params.name)
//   const data = {
//     name: req.params.name
//   }
//     .then(data => {
//       res.render('artists', data.name)
//         .catch(err => {
//           // ----> 'HERE WE CAPTURE THE ERROR'
//         })
//       res.render('artists', data)
//     });

app.get('/artists', (req, res) => {
  const artistas = req.params

  spotifyApi.searchArtists(artistas)
    .then(function (artistas) {
      console.log('Search artists by "Love"', artistas.body);
    }, function (err) {
      console.error(err);
    });
  res.render('artists', artistas)

})

app.listen(3000, () => console.log('Working'))
