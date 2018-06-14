var SpotifyWebApi = require('spotify-web-api-node');
const path    = require('path');

const express = require('express');
const app = express();
const hbs = require('hbs');
const prettyjson = require('prettyjson');
const bodyParser = require('body-parser');


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


var clientId = 'f42fa985ad714a798172335217056668',
    clientSecret = '8f92ab8d7ff743abaa23b932e5bde263';

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

app.get('/', (req, res) => {
  res.render('index');        //reference to views/index.hbs
});

app.get('/artists', (req, res) => {
  res.render('about');
});

app.post('/artists', (req, res) => {
  let name = req.body.artist;

  spotifyApi.searchArtists(name)
    .then(data => {
      console.log(data.body.artists.items)
      res.render('artists', data.body.artists);
    })
    .catch(err => {
      console.log('Something went wrong when retrieving an access token', err);
    })

});

app.listen(3000, () => {
  console.log('My first app listening on port 3000!')
});