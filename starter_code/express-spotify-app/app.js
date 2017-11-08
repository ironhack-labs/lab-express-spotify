const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
var SpotifyWebApi = require('spotify-web-api-node');

app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(morgan('dev'));
app.set('view engine', 'ejs');

// Remember to paste here your credentials
var clientId = 'b6041d7a45dd4dc5a287d269e79caa92',
    clientSecret = '9067cd40d1a042ec8190f71f21e1e049';

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

app.get('/', (req, res, next) => {
  res.render('index', {
  });
});

app.get('/artists', (req, res, next) => {
   let artist = req.query.artist;
   spotifyApi.searchArtists(artist)
   .then(function(data) {
     res.render('artists', {
       artists: data.body.artists.items
    });
   }, function(err) {
     console.error(err);
 });

 app.get('/artist/:id ', (req, res) => {
    spotifyApi.getArtist(req.params.id)
   .then(function(data) {
     console.log('Artist information', data.body);
   }, function(err) {
     console.error(err);
   });
 });

 });

app.listen(3000, () =>{
  console.log("listening");
});
