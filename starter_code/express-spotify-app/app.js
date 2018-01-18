/* require modules */
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require("body-parser");
const SpotifyWebApi = require('spotify-web-api-node');
const morgan = require('morgan');

const app = express();

app.use(express.static('public'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  morgan(`Request Method: :method, Request URL: :url, Response Time: :response-time(ms)`));

app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// Remember to paste here your credentials
var clientId = '79a4264da9f64d0a9512cfc9de3eef53',
    clientSecret = '766f24e8abc044178d64e7b634b3a99d';


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


/* Routes */


app.get('/', (req, res) => {
  res.render('home');
});

app.get('/home', (req, res) => {
  res.render('form')
}),

app.get('/artist', (req, res) => {
  let artist = req.query.artist;
  console.log(req.query.artist)

  spotifyApi.searchArtists(artist)
    .then(function(data) {
      console.log(data.body)
      res.render('artist', {
         artist: data.body.artists
       });
      

    }, function(err) {
      console.log(err);
    });
});






app.listen(3000, () => console.log("Ready!"));
