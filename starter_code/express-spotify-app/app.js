const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(expressLayouts);
//Necesitas crear el main-layout OK
app.set('layout', __dirname + '/views/layout/main-layout');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.get('/',(req,res)=>{
  res.render('home');
});

//Hago un formulario.
//Su action apunta a /artist es del tipo POST
//La info la recogo con req.body.artist
// LU Numero 3 de HOY
// Dentro de la peticion POST en APP JS tendré que hacer cosas
// Con el node-module de Spotify
// .then()--> Haremos el res.render('artist') --> Debo crear un
//layout de artist que reciobe un objeto (probablemente un array)
// pintarlo con FOR de EJS (LU Numero 3 de HOY).

app.get('/artists', (req, res) => {
   let artistSearch = req.query.artist;
   SpotifyApi.searchArtists(artistSearch)
     .then(function(data) {
       let artistsArray = data.body.artists.items;
       res.render('artists', {artists: artistsArray});
       }, function(err) {
       console.error(err);
     });
 });


// Remember to paste here your credentials OK
var clientId = '4cef80fcd7d742f08ef58db8456db9e2',
    clientSecret = '4cef80fcd7d742f08ef58db8456db9e2';

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


app.listen(3000, () => {
  console.log('listening on port 3000!');
});
