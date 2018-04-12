const express = require('express');
const app = express();
const hbs = require('hbs');
const path    = require('path');

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '689e62f5728c47e4aef6ea3f073b08ed',
    clientSecret = '287170622d69433c8abdc3f9810cd35e';

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

app.set('view engine','hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.render('index');
});



let port = 3000;

app.listen(port, () => {
  console.log(`Listening port: ${port}`);
});