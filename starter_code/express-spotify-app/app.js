const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

// Remember to paste here your credentials
const clientId = '7171cbafb83c496b910d1308f58bd0e7',
  clientSecret = 'fedc9b7b2af543fabcafecb6d0e71d24';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

app.set('views', __dirname + '/views/layouts');
app.set('view engine', 'ejs');

app.locals.title = 'my awesome site';

app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true}));

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.get('/', (req, res) => {
  res.render('index', {message: null});
});

app.post('/artists', (req, res) => {
//   let artistSearched = req.body.artist;
//   let data = data.body.artists.items;
//   res.render('artists', {data});
// }, function (err) {
//   console.error(err);
  res.render('artists');
});
// app.post('/artists', (req, res, next) => {
//   if (!req.body.name) {
//     const data = {
//       message: 'Insert artist'
//     };
//     res.render('index', data);
//   } else {
//     res.redirect('artists');
//   }
// });

app.listen(3001, () => {
  console.log('App started. Port: 3001!');
});
