const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

app.use(expressLayouts);
app.set('layout', 'index');

app.set('views', __dirname + '/views/layouts');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));


var SpotifyWebApi = require('spotify-web-api-node');

var clientId = '768cc38921184612a70af965b367911b',
    clientSecret = 'd383d23da69d40c3b579f934debce4d3';

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
  res.render('index');
});


app.get('/artist', (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
  .then((response) => {
    res.render('artist', {
      artist: response
    });
  }).catch((err) => {
    console.log("Unable to find the requested artist.");
  });
});




let port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
