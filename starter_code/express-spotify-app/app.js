const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
var spotifyResultList=[];

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = '0a4cb719d366483fbbb97ef534ccd17c',
    clientSecret = 'f39653d148544a6a935f0a75d4d8c55d';

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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index');
})

app.get('/artists', function (req, res) {
  //res.send(req.query.artist);
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      spotifyResultList=data.body.artists.items;
      // res.send(spotifyResultList[0]);
      res.render('result',spotifyResultList);
      // res.send(data.body.artists.total);
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
      res.send(err);
    })
})

app.listen(3000, () => console.log('Spotify search app listening on port 3000!'))