var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser');
const path = require('path');

app.use(express.static(path.join(__dirname + '/public')));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


const port = 3000;


// Remember to paste here your credentials
var clientId = '6a308050a9f344fd95600652e35223bf',
    clientSecret = '4d652206d1654d1180afbc90c99dc397';

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

//rutas
app.get('/', (req,res)=>{
  res.render('home');
});

app.post('/artists', (req,res)=>{
  let query = req.body.artist;
  spotifyApi.searchArtists(query)
    .then(data => {
      res.render('artists', data)
    })
    .catch(err => {
      res.send(err);
    })
})

app.get('/albums/:id', (req,res)=>{
  let id = req.params.id;
  spotifyApi.getArtistAlbums(id)
    .then(data=>{
      res.render('albums', data)
    })
    .catch(err=>{
      res.send(err);
    })
})

app.get('/tracks/:albumId', (req,res)=>{
  let albumId = req.params.albumId;
  spotifyApi.getAlbumTracks(albumId)
    .then(data=>{
      res.render('tracks', data)
    })
    .catch(err=>{
      res.send(err)
    })
})


app.listen(port,()=>{
  console.log('Corriendo en el puerto 3000');
})