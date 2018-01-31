'use strict';

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

//configure app
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

var SpotifyWebApi = require('spotify-web-api-node');


var clientId = '9c2ce4fddfab4f0e87443a0af21168f8',
    clientSecret = '89246e43ea7c40cc99ee0335ca320304';

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
    res.render('index');
    // res.redirect('localhost:3000/artist')
  });

app.get('/artist',(req, res, next) => {
    
})


app.post('/artists',(req, res, next) => {
    
    res.render('artists')
} )


  
  app.listen(3000, () => {
    console.log('App started listening on port 3000!');
  });