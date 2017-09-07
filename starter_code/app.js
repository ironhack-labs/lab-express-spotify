const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
var SpotifyWebApi = require('spotify-web-api-node');
const app = express();
app.use(expressLayouts);
app.set('layout', 'main');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));
var clientId = '1c30624cba6742dcb792991caecae571',
  clientSecret = '746977b1e77240faa9d0d2411c3e0efe';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});
app.get('/', function(req, res) {
  res.render('index');
});
app.get('/artist', (req, res) => {
  res.render('artist');
});
var artist = {name:"pepe"};
app.post('/', (req,res) =>{
  artist.push({name:req.body.artist});
console.log(artist + "y yo");
res.render('artist');
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  });
let port = 3000;
app.listen(port, () => {
  console.log(`My first app listening on port ${port}!`);
});
