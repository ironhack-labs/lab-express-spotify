const express = require('express');
const app = express();


app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = 'c68b5ea1207c4fc3ae3fa25ac1198577',
    clientSecret = '63c54f3804004289a87e92fbdb59ad98';

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


// our first Route:
app.get('/artists', (req, res) => {
  //let artist    = req.body.artist;
  //res.render('index', {artist: artist});
  res.render('index');
});

// Server Started
app.listen(3000, () => {
  console.log('My first app spotify listening on port 3000!');
});


