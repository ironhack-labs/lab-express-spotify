const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();


app.use(express.static('public'));

app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Index Route:
app.get('/', (req, res, next) => {
  res.render('index');
});

// Artist Route:
app.get('/artists', (request, response, next) => {
  response.send('Welcome to the Artist Page');
  next();
});

// start server
app.listen(3000, () => console.log('The server has started'));

/*
const SpotifyWebApi = require('spotify-web-api-node');

const spotify = new SpotifyWebApi();

spotify.searchArtists('The Beatles', {}, (err, data) => {
  if (err) throw err;

  let artists = data.body.artists.items;
  console.log(artists);
});
*/
