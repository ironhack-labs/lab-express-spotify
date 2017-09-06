const SpotifyWebApi = require('spotify-web-api-node');
// Remember to paste here your credentials
const clientId = 'a36d34bce1954db1b5b32e164c1ccf43',
    clientSecret = '0315373a3a444091a4314b78759f447c';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');


app.use(express.static('public'));
app.use(expressLayouts);

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


app.get('/', (request, response, next) => {
  response.render('index');
});

app.get('/artists', (request, response, next) => {

  spotifyApi.searchArtists(request.query.artists)
    .then((data) => {
        let artists = data.body.artists.items;
      response.render('artists', {artists} );
    }, function(err) {
      console.error(err);
    });
});






app.listen(5000, () => console.log('running!'));
