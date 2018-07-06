const express = require('express');
const cows    = require('cows');
const hbs     = require('hbs');
const path    = require('path');
const chalk   = require('chalk');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');

const vacas   = cows();
const app     = express();
let vacaRandom = vacas[Math.floor(Math.random() * 250)];

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({ extended: true }));

// se agregaron las variables de ambiente dentro de ubuntu
// /etc/environment
// clientID="d405..."
// clientSecret="6d1..."

var varClientId = process.env.clientID;
var varClientSecret = process.env.clientSecret;

var spotifyApi = new SpotifyWebApi({
  clientId : varClientId,
  clientSecret : varClientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log(chalk.yellow('Autenticando...'));
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log(chalk.yellow('Autenticando OK'));
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  let artist = req.query.artist;
  spotifyApi.searchArtists(artist)
    .then(data => {
      // console.log(data);
      // console.log(data.body.artists.items[0]);
      res.render('artists', { artists: data.body.artists.items });
    })
    .catch(err => {
      res.render('error');
    });
});

app.get('/albums/:artistId', (req, res) => {
  // console.log(req.params.artistId);
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
      // console.log('Artist albums', data.body);
      res.render('albums', { albums: data.body.items });
    })
    .catch(err => {
      res.render('error');
    });
});

var infoTracks = [];
var liga;
app.get('/tracks/:albumId', (req, res) => {
  console.log("Album: " + req.params.albumId);
  spotifyApi.getAlbumTracks(req.params.albumId, { limit : 20, offset : 1 })
  .then(data => {
      infoTracks = [];
      for(let i = 0; i < data.body.items.length; i++){
        console.log(data.body.items[i].id);
        buscaInfoDeCadaTrack(data.body.items[i].id);
        data.body.items[i].ligaWeb = liga;
      }
      // console.log(infoTracks);
      res.render('tracks', { tracks: data.body.items });
    })
    .catch(err => {
      console.log("Error al buscar tracks del album " + req.params.albumId);
      res.render('error');
    });
});

function buscaInfoDeCadaTrack(trackId){
  /* Get Audio Features for a Track */
  spotifyApi.getAudioFeaturesForTrack(trackId)
    .then(data => {
      // console.log(data.body);
      infoTracks.push(data.body);
      liga = data.body.track_href;
      console.log(liga);
    })
    .catch(err => {
      console.log("Error al buscar info del track " + trackId);
    });
};

app.listen(3000);
console.log('App inicianlizada');
console.log(chalk.yellow(vacaRandom));
// console.log(process.env.TOMCAT); // export TOMCAT="tomcatvar"
