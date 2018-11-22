var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')
const app = express()
const hbs = require('hbs')
const bodyParser = require('body-parser')
const routes = require('./routes/rutas')

app.use(express.static('public'))
app.use('/',routes)

app.set('views', __dirname +'/views')
app.set('view engine','hbs')
app.use(bodyParser.urlencoded({ extended: true }));

// Remember to paste your credentials here
var clientId = '6cfb0c49a6ea4c9ab85f28c89cbfac62',
    clientSecret = 'c76c896435e64db2a94299f943b563c8';

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
app.listen(3000,()=>{
    console.log("conexion realizada")
})