
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require("path");
const SpotifyWebApi = require('spotify-web-api-node');
const PORT = 3000;

// Remember to paste here your credentials
const clientId = '62ff5ab4fb0b440c9ab6aad80eafc4ac',
    clientSecret = '3a11edf4624148b492426484742b720b';

    const spotifyApi = new SpotifyWebApi({
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


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
  res.render('index')
})


app.listen(PORT, () => {
  console.log('CONNECTED')
});