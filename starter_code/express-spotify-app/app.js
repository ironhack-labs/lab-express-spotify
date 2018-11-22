const express = require('express');
const app = express();
const hbs = require('hbs');

//static
app.use(express.static('public'))
//views
app.set('views',__dirname + '/views')
app.set('view engine','hbs')

var SpotifyWebApi = require('spotify-web-api-node');

//routes
const spotifyRoutes = require('./routes/spotifyroutes')
app.use('/',spotifyRoutes)

// Remember to paste your credentials here
var clientId = '5a4842ba39bd45a5b95f9b12f7be1a54',
    clientSecret = '92cef8bf488d4f6d995ab69f7e4f3c7b';

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

// app.get('/',(req,res)=>{
//   res.send('qué tranza Spotify')
// })

app.listen(3000,()=>{
  console.log('App running mongoose again!')
})