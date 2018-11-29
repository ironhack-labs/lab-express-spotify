
const express = require('express')
const app     = express()
const hbs     = require('hbs') 
const path    = require ('path')

const SpotifyWebApi = require('spotify-web-api-node');

const artist = {artist: ''}

const bodyParser = require('body-parser');
app.use (bodyParser.urlencoded({extended:true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
    res.render ('index') //afficher l'index
})

app.get('/artists', function (req, res,next) {
    res.render ('index',{artist}) //afficher l'index
})

// Remember to paste your credentials here

var clientId = '0088c9056ddd4628a42ab2c71314368c',
    clientSecret = '2b24b3bcaa5c4464902932e9fc4751d6';

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

app.listen(3000, () => console.log('Example app listening on port 3000!'))



