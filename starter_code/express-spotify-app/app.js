/*jshint esversion: 6*/
const SpotifyWebApi   = require('spotify-web-api-node');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan     = require('morgan');

const spotify = new SpotifyWebApi();
const app = express();

app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('dev'));

// spotify.searchArtists("The Beatles", {}, (err, data) => {
//   if (err) throw err;
//
//   let artists = data.body.artists.items;
//   console.log(artists);
// });

app.get('/', (request, response, next) => {
  response.render('index');
});

app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
