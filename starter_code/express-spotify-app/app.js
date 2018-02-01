// Express
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

// Views, Layouts, Static
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.set('layout', 'layouts/layout');

app.use(express.static('public'));
app.use(expressLayouts);

const SpotifyWebApi = require('spotify-web-api-node');

// Spotify API Remember to paste here your credentials
const clientId = '0d56f8af23cf4b96a194df7d67e39eda',
    clientSecret = 'ca8d67f070484251bb766c28cc9dccd5';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Spotify API Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


// Render Index
app.get('/', (req, res, next) => {
  res.render('index');
});


// Server Started
app.listen(3000, () => {
  console.log('Port 3000');
});