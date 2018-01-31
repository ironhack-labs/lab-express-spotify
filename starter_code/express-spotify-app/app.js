const express = require("express");
const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'b48ebba12bca41b3b79afd6e229ec7ff',
    clientSecret = '05acd75478f64d1893b3a57b77e99704';

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

app.listen(3000);