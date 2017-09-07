const express = require('express');
const expressLayouts = require('express-ejs-layouts');
var SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');

const app = express();

var clientId = 'd6402f66965a474594db4e0b75b53369',
    clientSecret = 'b5e4aebd5a584e3c8693cee90843db0e';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res) =>{
  res.render('index');
});

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.post('/artists', (req,res) =>{
  spotifyApi.searchArtists(req.body.artistName)
  .then((response) => {
    // res.send(response)
    res.render('artists', {
      artistInfo: response.body.artists.items,
    });
  }).catch(err => {})
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then((response) => {
    // res.send(response.body.items)
    res.render('albums', {
      albumInfo: response.body.items,
    });
  }).catch(err => {})
});



// Server Started
let port = 3000;
app.listen(port, () => {
  console.log(`My first app listening on port ${port}!`)
});
