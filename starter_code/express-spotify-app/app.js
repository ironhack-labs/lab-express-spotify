var SpotifyWebApi = require('spotify-web-api-node');
var clientId = '60eb2d4cfe204167a9bfcd507f5c58a9',
clientSecret = '04a400fc29004fcbb0bf4b301eda9727';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

app.use(express.static('public'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/main-layout');
app.set('view engine', 'ejs');

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

app.get('/index', (req, res, next) => {
  res.render('index')
})

app.get('/artists', (req, res, next) => {
  const artist = req.query.artist;
  spotifyApi.searchArtists(artist)
  .then((result) => {
    const alb = result.body.artists.items;
    console.log(req);
    res.render('artists', {
      alb
    })
  })
  .catch((err) => {
    console.error(err)
    res.sendStatus(500)
  })
})
app.listen(3000, () => {
  console.log('connect on port 3000');
})
