const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views/layout');
app.use(express.static(path.join(__dirname, 'public')));

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '94ef9cbc17e44afb9a9045f8bea4c82e',
    clientSecret = 'bf85da138a2c43d3abe0b4ce8c007d31';

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

app.get('/', (req, res, next)=> {
  res.render('index');
})

app.get('/artists', (req, res, next)=> {
  spotifyApi.searchArtists(req.query.artist)
  .then(data =>{
    res.render('artists', {artists: data.body.artists.items})
  })
  .catch(err => {
    console.log('Something went wrong', err)
  })
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    res.render('albums', {albums: data.body.items})
  })
  .catch(err => {
    console.log('Something went wrong', err);
  }) 
});

app.listen(3000)