let SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, '/public')));
hbs.registerPartials(__dirname + '/views/partials');
app.use(bodyParser.urlencoded({extended: true }));


// Remember to paste here your credentials
let clientId = '238e949eb27d435db2bef51159fd963e',
  clientSecret = '31a267b856ff4d08a27ae0f852298c70';

let spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);
//rutas de hbs
app.get('/', (request, response, next) => {
  response.render('index');
});
//direccion de artistas 
app.get('/artists', (request,response,next)=>{
  spotifyApi.searchArtists(request.query.artist )//busqueda en la base de artistas 
  .then(data =>{
    //que hacer con la info 
    let artists = data.body.artists.items; // agrega valor a artists para enviar a html 
    response.render('artist',{artists});
  })
  .catch(error => {
    console.log(error);
  })
})
//direccion de albums
app.get('albums/:artistId',(request, response)=>{
  spotifyApi.getArtistAlbums(request.params.artistId)
  .then(data => {
    let albums = data.body.items;
    response.render('albums', {albums});
  })
  .catch(error =>{
    console.log(error);
  })
})
//direccion de tracks 
app.get('/tracks/:albumId',(request, response) => {
  spotifyApi.getAlbumTracks(request.params.albumId)
  .then(data =>{
    let tracks = data.body.items;
    response.render('tracks', {tracks});
  })
  .catch(error =>{
    console.log(error);
  })
});
//ruta basica del index
app.listen(3000);
