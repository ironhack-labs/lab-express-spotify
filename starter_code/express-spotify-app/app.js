const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
var SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.use(expressLayouts);
app.set('layout', 'index');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

var clientId = '0c9bde8be5024f2c8526a0cbc6ca92a9',
    clientSecret = 'ef50816d60044452b1421c5bc04d0aad';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (request, expressResponse, next) => {
  console.log(expressResponse)

  spotifyApi.searchArtists('Puscifer')
    .then((spotifyApiResponse) => {
       console.log('Search artists by "Love"', spotifyApiResponse.body.artists.items);
    }, function(err) {
      console.error(err);
    });

  let filename = __dirname +'/views/layouts/index.html';
  expressResponse.sendFile(filename);
});

app.get('/artists', (request, response, next) => {
  const elvis = '43ZHCT0cAZBISjO8DG9PnE'
  spotifyApi.searchArtists(elvis)
    .then(function(data) {
      console.log(data);
    })
});

let port = 3000;
app.listen(port, () => {
  console.log(`My first app listening on port ${port}!`);
});
