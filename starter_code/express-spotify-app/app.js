

// Remember to paste here your credentials
var clientId = 'ca761f6905f1401ca68f5a313b292d8e',
    clientSecret = '6bbab67fcd024ea4a4a965145909dbbf';

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

var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


const PunkAPIWrapper = require('punkapi-javascript-wrapper');
const punkAPI = new PunkAPIWrapper();



app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', (req, res, next) => {

  res.render('index');
});

app.get('/beers', (req, res, next) => {
  punkAPI.getBeers().then(beers => {
    console.log(beers);
    res.render('beers', {
      beers
    });
  })
});

app.get('/random-beer', (req, res, next) => {
  punkAPI.getRandom()
    .then(beers => {
      res.render('random-beer', {
        beers
      })
    })
    .catch(error => {
      console.log(error)
    })

})

app.listen(3000);







