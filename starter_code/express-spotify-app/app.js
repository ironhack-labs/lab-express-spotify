const express = require('express');
const app = express();
const hbs = require('hbs');
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

var SpotifyWebApi = require('spotify-web-api-node');

// Already refreshed with my credentials
var clientId = 'e08015b8dda74cd2905706e3ceb3a7d1',
    clientSecret = 'aa1a0efc203e44a5a031ea80a6a7808d';

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

app.get('/home', (req, res, next) => {
  res.render('home');
})

app.get('/artists', (req, res, next) => {
  let searchedArtist = req.query.artist;
  
  spotifyApi.searchArtists(searchedArtist)
  .then(data => {
    res.render('artists', {result: data.body.artists.items});
    res.render('artists', {artistImage: data.body.artists.images[0]})
  })
  .catch(err => {
    console.log('something went wrong on spotifyApi', err);
  })
})

app.get('/albums/:artistId', (req, res) => {
  let viewButton = req.params.artistId;
  spotifyApi.getArtistAlbums(viewButton)
  .then(data => {
    res.render('artists', {viewButton: data.body.artists.album})  
    console.log('Artist albums', data.body);
    })
  .catch(err => {
    console.log('artistId search not working', err)
  })
});

app.listen(3000, () => {  
  console.log('started');
});
