/*jshint esversion: 6 */

const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();
const express         = require('express');
const morgan          = require('morgan');
const expressLayouts  = require('express-ejs-layouts');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({extended: true}));

app.set('layout', 'layouts/main_layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(morgan('dev'));

app.get('/', (req, res, next) => {
  res.render('index');
  return;
});

app.post('/artists', (req, res, next) => {
  let artist = req.body.artist;
  spotify.searchArtists(artist, {}, (err, data) => {
    if (err) throw err;
    let artists = data.body.artists.items;
    res.render('artists', { artists });
  });
});

app.post('/albums', (req, res, next) => {
  let artist = req.body.artist;
  spotify.searchArtists(artist, {}, (err, data) => {
    if (err) throw err;
    let artists = data.body.artists.items;
    res.render('artists', { artists });
  });
});





// Server Started
app.listen(3000, () => {
  console.log('My first app listening on port 3000!');
});
