const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

const SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
const clientId = '6decf53c4bbb4f0bb5c0f70d4cec515a',
    clientSecret = '4cbcaca73e84487ba9baa6a578835d8b';

const spotifyApi = new SpotifyWebApi({
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

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', __dirname + '/views/layout/main_layout');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(express.static('public'));

app.get('/',(req,res)=>{
  res.render('index');
});

app.get('/artists',(req,res)=>{
  let artist = req.query.artist;
  spotifyApi.searchArtists(artist)
  .then(function(data) {
    res.render('artists', {artists: data.body.artists.items});
  }, function(err) {
    console.error(err);
  });
});

app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
