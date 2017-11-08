const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
//const ejsLinter = require('ejs-lint');
const app = express();

app.use(express.static('files'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', __dirname + '/views/layout/layout');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));
//app.use(ejsLinter);

// Remember to paste here your credentials
let clientId = 'e739f9bb9c3b43c7b0eef0016b37f560',
    clientSecret = 'c3195235535944a99dd50cf99d53bec7';

let spotifyApi = new SpotifyWebApi({
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

app.get('/',(req,res)=>{
  res.render('home');
});

app.get('/artists', (req, res) => {
  // Get multiple artists
  let artist = req.query.artist;
  spotifyApi.searchArtists(artist)
    .then(function(data) {
      console.log('Artists information', data.body.artists);
      res.render('artist', {data});
    }, function(err) {
      console.error(err);
    });
});

app.listen(3000, () => {
  console.log('Server running!');
});
