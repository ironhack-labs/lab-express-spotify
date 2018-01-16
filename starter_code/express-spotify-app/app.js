// Constantes del programa //

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require("body-parser");
const app = express();
const morgan = require('morgan');

// app.use //

app.use(express.static('public'));
app.use(morgan(`Request Method: :method, Request URL: :url, Response Time: :response-time(ms)`));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));

// app.set //

app.set('layout', 'layout/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// peticiones al servidor //

// Peticion inicial, ruta a index //
app.get('/index', (req, res) => {
  res.render('index');
});

// Peticion para buscar a los artistas, es un post a traves de un form //
app.post('/artists', (req, res) => {
  let nameOfArtist = req.body.artist;
  //Busqueda en la API de spotifyApi, queremos que coja el nameOfArtist y nos devuelva un objeto//
  spotifyApi.searchArtists(nameOfArtist)
    .then(function(data) {
      res.render('artists', {
        nameOfArtist: nameOfArtist,
        artistItems: data.body.artists
      })
    }, function(err) {
      console.error(err);
      res.render('artists')
    });
})

 //Busqueda en la API de los albumes del artista que hemos guardado como param a traves del ID//
app.get('/albums/:artistID', (req, res) => {
  let artistID = req.params.artistID;
  //Busqueda en la API de spotifyApi, queremos que coja el artistID y nos devuelva un objeto//
  spotifyApi.getArtistAlbums(artistID)
    .then(function(data) {
      res.render('albums', {
        artistAlbums: data.body.items
      })
    }, function(err) {
      console.error(err);
    });
})

//Busqueda en la API de las canciones del album que hemos guardado como param a traves del ID//
app.get('/track-list/:albumID', (req, res) => {
  let albumID = req.params.albumID;
  //Busqueda en la API de spotifyApi, queremos que coja el ID del album y nos devuelva un objeto//
  spotifyApi.getAlbumTracks(albumID, {
      limit: 10,
      offset: 1
    })
    .then(function(data) {
      res.render('track-list', {
        trackItems: data.body.items
      })
    }, function(err) {
      console.log('Something went wrong!', err);
    });
})

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '87f6d727ea40438db933e56f97571f20',
  clientSecret = 'b075e97d5936419cb3d4e07911956ccb';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  });


app.listen(3000, () => console.log("Ready!"));
