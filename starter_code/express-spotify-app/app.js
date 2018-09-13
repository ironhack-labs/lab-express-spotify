const express = require('express');
const app = express();
const path    = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
var SpotifyWebApi = require('spotify-web-api-node');
app.use(bodyParser.urlencoded({ extended: true }));

hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + '/views/partials');


// Remember to paste here your credentials
var clientId = '0e5120d1e41c4cfba15184f7b57cb07b',
    clientSecret = 'e48d192ae4e843da8882ca7f2e3399d6';

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


app.get('/', (req, res) => {
  res.render('index')
});

app.get('/artists',(req,res)=>{
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render('artists',{data})
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })
})

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      res.render('albums',{data})
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })
});

app.listen(3000, () => {
  console.log("listening 3000")
});