var SpotifyWebApi = require('spotify-web-api-node');
var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
 
// Remember to paste here your credentials
var clientId = '20160c41f58543b9805c1dc5dcf640e1',
    clientSecret = 'c9ccb36592b8436395e68c7f6149fc02';

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
  res.render('index');
  next();
})

app.get('/artists', (req, res, next) => {
  res.render('artists');
  next();
})

app.get('/public', (req, res, next) => {
  res.render('')
})

app.listen(3000, () => {
  console.log('yolo');
})