var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const path=require("path")
const app = express();
const hbs = require('hbs');

// Remember to paste here your credentials
var clientId = 'd534893b6f5242c5bad45d0ba6363da9',
    clientSecret = 'f5061b5a8463412bb6eb2fea847eaf30';

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

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.render('home');
});

app.post("/",(req,res,next)=>
{
  req.body.nomArt
})

app.listen(3000);