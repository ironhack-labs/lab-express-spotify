const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const bodyparser = require('body-parser')
const hbs = require('hbs');
const debug = require('debug')('irondemo:app');
const path = require('path');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.urlencoded({ extended: true }));



// Remember to paste here your credentials
var clientId = '389547d61b4b40b58143d62f9f751f39',
    clientSecret = '879f9cecbce14be59bb4d3f3173ad129';

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


app.get('/',(req,res) => {
    res.render('home',{
    });
}) 


app.post('/artists', (req, res) => {
    let artist = req.body.artist;
    spotifyApi.searchArtists(artist)
    .then(data => {
      console.log(data); //poner siempre el cnsole con lo que vaya despues del then, en este caso data
      let artistArr = data.body.artists.items;
      res.render('artists',{data: artistArr});
    })
    .catch(err => {
      console.error(err);
    })
});

app.get('/albums/:artistId', (req, res) => {
  let albums = req.params.artistId;
  
  spotifyApi.getArtistAlbums(albums)
  .then((data) => {
    let albumArr = data.body.items; //Lo que devuelve la API
    res.render('album', {albumArr});
  })
  .catch((err) => {
    console.error(err);
  })
});

app.get('/songs/:albumId', (req, res) => {
  let albumId = req.params.albumId;
  
  spotifyApi.getAlbumTracks(albumId)
  .then((data) => {
    let songsArr = data.body.items;
    console.log(data)
    res.render('songs', {songsArr});
  })
  .catch((err) => {
    console.error(err);
  })
});

app.listen(3000, () => {
    console.log('listening')
})