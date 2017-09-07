const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const app = express();

app.use(expressLayouts);
app.set('layout', 'index');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

var SpotifyWebApi = require('spotify-web-api-node');

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
    //console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (request, res) => {
  res.render('index')
});

app.post('/artists', (request, expressResponse, next) => {
  spotifyApi.searchArtists(request.body.artist)
    .then((spotifyApiResponse) => {
       myArtists = spotifyApiResponse.body.artists;
       console.log(myArtists)
    }, function(err) {
      console.error(err);
    });

  
})

app.get('/artists', (request, response, next) => {
  response.render('/artists')
})

let port = 3000;
app.listen(port, () => {
  console.log(`My first app listening on port ${port}!`);
});
