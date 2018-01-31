const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const app = express();


//Preguntar exactamente como funciona
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// Remember to paste here your credentials
const clientId = '0d2e24babe9d44c78868ff575f9dabca',
clientSecret = '04d1d411a81e439fa709db61fb401f4b';

const spotifyApi = new SpotifyWebApi({
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

app.get('/', (req, res) => {
  res.render('index');
});

//Error : Cannot GET /artist 
app.post('/artists', (req, res, next) => {
  const searchArtist = req.body.artist;
  spotifyApi.searchArtists(searchArtist).then((response) => {
    const artists = response.body.artists.items;
    res.render('artists', { artists, searchArtist });
  }).catch(function (err) {
    console.log("Creo que algo no funciona bien", err);
  });
});

app.listen(3000, () => {
  console.log('Listening on port 3000!')
});