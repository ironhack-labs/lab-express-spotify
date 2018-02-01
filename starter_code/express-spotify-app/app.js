const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
var SpotifyWebApi = require('spotify-web-api-node');

//app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(expressLayouts);



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


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
app.get('/', (req, res) => {

  res.render('index');
});

app.post('/artists', (req, res) => {
  let artist = req.body.artist;
  //console.error(req.body);

 spotifyApi.searchArtists(artist)
 .then(function(data) {
 console.log(`Search artists by ${artist}, ${data}`);
 }, function(err) {
 console.error(err);
});

 res.render('artists', {artist})

  
});

// Server Started
app.listen(3001, () => {
  console.log('My first app spotify listening on port 3001!');
});


