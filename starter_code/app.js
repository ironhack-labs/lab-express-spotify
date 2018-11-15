const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');


hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}))


var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = '3b337b9b220243878cbbf6a3e26ffc95',
    clientSecret = 'dd3f4377279f4700a21dea4492b00d16';

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


app.get('/', (req, res, next) => {
  res.render('home');
});

app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
  .then(artists => {
    let artistas = artists.body.artists.items
    res.render('artists', {artistas: artistas})
  })
  .catch(err => {
    console.log(`You have an ${err}`)
  })
});


app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(albums => {
    let albunes = albums.body.items
    res.render('albums', {albunes})
  })
  .catch(err => {
    console.log(`You have an ${err}`)
  })

});

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(tracks => {
    let canciones = tracks.body.items;
    console.log(canciones);
    res.render('tracks', {canciones})
  })
  .catch(err => {
    console.log(`You have an ${err}`)
  })

});


app.listen(3000);