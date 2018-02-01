var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const prettyJson = require('prettyjson');
const morgan = require('morgan');

const app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', (req, res, next) => { 
  let data = {
    name: "Spotify",
    type: "application"
  };
  res.render('index', data); // I dont understand why we use response, is it a response
});                          //  to the response of my request??


app.listen(3000,() => {
  console.log('Listeninng on port 3000');
});

// Remember to paste here your credentials
var clientId = 'de05d80b9f2540d4a0d51f5344718aee',
  clientSecret = '8dbcbab7f3ef4fa2be5298278f4cf9c3';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });