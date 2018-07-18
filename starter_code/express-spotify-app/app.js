const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path')
var SpotifyWebApi = require('spotify-web-api-node');

hbs.registerPartials(path.join(__dirname, '/views/partials'))

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(__dirname + '/public'));


// Remember to paste here your credentials
var clientId = '027de62370f649359d67964a5e5f2837',
  clientSecret = 'a468afedae00471890ec37d3d1e16a10';

var spotifyApi = new SpotifyWebApi({
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
  res.render('index')
})

app.get('/artists', (req, res, next) => {
  //console.log(req.query.artists)
  spotifyApi.searchArtists(req.query.artists)
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      dataReceived = data.body.artists
      // console.log(dataReceived) 
      res.render('artists', dataReceived)
    })
    .catch(err => {
      console.log(err);
    })
})



app.listen(3000, () => {
  console.log('server on line. waiting for query...')
})