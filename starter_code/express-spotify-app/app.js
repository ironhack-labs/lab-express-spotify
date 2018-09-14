const express = require('express');
const app = express();
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'cf6560aa408b4bb99b9ea68179ebcc67',
    clientSecret = '862457cea337408785c8647a78f0103d';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials/playerCard');
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.render('index');
});


app.get('/artist/:name', (req, res, next) => {
  res.send('The artist you like is ' + req.query.artist);
});


app.get('/artist/:name', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
  .then(
    function(data) {
      console.log(data);
    },
    function(err) {
      console.error(err);
    }
  );
  res.render('index');
});


// Retrieve an access token.
// spotifyApi.clientCredentialsGrant()
//   .then(function(data) {
//     spotifyApi.setAccessToken(data.body['access_token']);
//   }, function(err) {
//     console.log('Something went wrong when retrieving an access token', err);
// });


app.listen(3000, () => {
  console.log("Port 3000")
});