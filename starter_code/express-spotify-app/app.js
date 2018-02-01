var SpotifyWebApi = require('spotify-web-api-node');
const bodyParse = require('"body-parser": "^1.18.2"');
const ejs = require('"ejs": "^2.5.7"');
const express = require('""express": "^4.16.2""');
const expressEjsLayouts = require('"express-ejs-layouts": "^2.3.1"');
const morgan = require('"morgan": "^1.9.0"');
const prettyJson = require('"prettyjson":"^1.2.1"')
const spotifyWebApiNode = require('"spotify-web-api-node": "^2.5.0"');

// configure app 
app.set('views', __dirname + '/views');
+app.set('view engine', 'ejs');

// Remember to paste here your credentials
var clientId = '1c30624cba6742dcb792991caecae571',
    clientSecret = '746977b1e77240faa9d0d2411c3e0efe';

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

app.get('/', (request, response, next) => {
  console.log(request);
  res.render 
});