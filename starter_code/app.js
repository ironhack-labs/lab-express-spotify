'use strict';

const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const app = express();

//configure the app
app.use(expressLayouts);
app.use(express.static('public'));

app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//Spotify API
var clientId = '33fc33fd5b0a4143b6fcdf3a19a2918b',
    clientSecret = 'c2b795761cee4fefaccda633edb344d6';

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

//Routes
app.get('/', (req, res, next) => {
  res.render('home');
});

app.get('/artists', (req, res, next) => {

  spotifyApi.searchArtists(req.query.artist)
  .then((data) => {
    let artists = {
      artist : data.body.artists.items
    }
    console.log("entra pero falla");
    res.render('artists', artists );
  }, (err) => {
    console.log("errrrrror", err);
  });

});

// app.post('/contact-us', (req, res, next) => {
//   console.log(req.body);
//   if(!req.body.name || !req.body.subject ){
//     const data = {
//       message: "alert"
//     }
//     res.redirect('contact', data);
//   }
//   else {
//     res.redirect('./');
//   }
// });


app.listen(3001, () => {
  console.log('Spotify Express DE in port 3001!')
});