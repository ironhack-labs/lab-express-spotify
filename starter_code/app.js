const express = require('express');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');
var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'c2811cf31f664c00a18478c4c44ccb15',
    clientSecret = '741b23e3476046098f34057cc09b06c8';

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

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true}));

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));


app.get('/', (req, res, next) => {
  res.render('index');
})


app.get('/artists', (req, res, next) => {
  const {name} = req.query;

  spotifyApi.searchArtists(name)
    .then(artists => {
      const artistArr = artists.body.artists.items;
      res.render('artists', {artistArr});
      console.log(artistArr);
    })
    .catch(error => {
      console.log(error);
    })
})



app.listen(3000);