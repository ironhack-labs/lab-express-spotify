const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const SpotifyWebApi = require('spotify-web-api-node');
const clientId = '130309a175f5439691f29b71820e47a5',
      clientSecret = 'a833cbef9f5d42aba52ae37462f2b66c';

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
app.set('layout', __dirname + '/views/layout/main-layout');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(express.static('public'));

app.get('/',(req,res)=>{
  res.render('index');
});

app.get('/artist', (req,res)=>{
  let artist = req.query.artist;
  spotifyApi.searchArtists(artist)
  .then(function(data) {
    console.log('Search this '+ artist, data.body);
    res.render('artist', {artists: data.body.artists.items});
  }, function(err) {
    console.error(err);
  });
});



app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
