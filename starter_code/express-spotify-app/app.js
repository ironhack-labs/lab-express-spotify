const express = require('express');
const app = express();
const hbs = require('hbs');
// const bodyParser = require('body-parser');
app.set('view engine','hbs');
app.set('views', __dirname + '/views');
// app.use(bodyParser.urlencoded({ extended: true }));


var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '7078e3066f864e1cbdde3aad5ca5da6f',
    clientSecret = 'e3ed377feb6042bbb116c676638ed9c2';

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

app.get('/', (req, res)=> {
  res.render('index')
})

app.get('/artists', function (req, res) {
  console.log("req.query");
  res.send(req.query)
})

app.listen(3000);


