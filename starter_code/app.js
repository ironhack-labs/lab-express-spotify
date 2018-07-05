const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');

app.set('views', path.join(__dirname, 'views/layouts'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
    res.render('index');
});

// Remember to paste here your credentials
const clientId = '648aa623157a4caba3b8d1e90d3ad33d';
const clientSecret = 'd467fde767834e8686fd281cd0d30dbd';

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


app.listen(3000);
