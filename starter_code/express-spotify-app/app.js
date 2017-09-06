var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

app.use(express.static('./public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');

// Remember to paste here your credentials
var clientId = 'c8f13229d8d149828f8da1a29baf80b2',
    clientSecret = 'f5190a42cb51496d886d3092e81f1485';

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
    res.render('index')
});

app.get('/artists', (req, res, next) => {
    const artist = req.query.artist;
    spotifyApi.searchArtists(artist)
    .then(function(data) {
      res.render('artists', {name: artist});
    }, function(err) {
      console.error(err);
    });
  
});


app.listen(3000, () => console.log('IH Spotify'));