
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname,'public')));

// Remember to paste your credentials here
var clientId = '15ba046ee1564552893a8f02b1cd20a6',
    clientSecret = '0b95954231fd4b498671ae3d1ce6bc34';

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


app.get('/', function (req, res) {
  res.render('search')
})

app.get('/artists', function (req, res) {
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render('artists', data.body.artists.items)
    })
    .catch(err => {
      console.log("Ha ocurrido un error", err)
    })

  })





app.listen(3000, () => console.log('Example app listening on port 3000!'))
