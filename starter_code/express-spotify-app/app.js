var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
    res.render('index');
})
app.get('/artist', function (req, res) {
    const artist = req.query.artist;
    spotifyApi.searchArtists(artist)
    .then(data => {
      const songs = {song:data.body.artists.items};
        res.render('artist', {songs})
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => { console.log('An error happened:', err) 
      // ----> 'HERE WE CAPTURE THE ERROR'
});

  app.get('/albums/:artistId', (req, res) => {
      const artistAlbum = req.params.album;
      spotifyApi.getArtistAlbums(artistAlbum)
      .then(data => {
        const artistAlbums = {artistAlbum:data.body.artist.album}  
          res.render('album', {artistAlbums})
      }, function(err) {
        console.error(err);
 
});


var clientId = 'd4cfe9a7536d4ba8b9dae6f18014a3db',
    clientSecret = 'bf5efbaa96c54e9dba2fa9d3af369873';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.listen(3000, () => {
    console.log('Por si es necesario');
  });