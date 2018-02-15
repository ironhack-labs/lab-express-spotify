const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express()

app.use(express.static('public'));
console.log(__dirname)
app.set('views',__dirname + '/views ');
app.set('view engine', 'ejs');

// Remember to paste here your credentials
var clientId = 'c298c645207b4420ae0b0f0322f89122',
    clientSecret = 'ea1386f3d58d4cd2927a2ea4c07ddf56';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.get('/', function(req, res,next){
    res.send('Traigan tributos!')
});

app.get('/artists',function(req, res){
    res.render('artist')
});




app.listen(3000, function(err){
    if(err) console.log(err);
    console.log('ya sirve esta mierda')
})
// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});