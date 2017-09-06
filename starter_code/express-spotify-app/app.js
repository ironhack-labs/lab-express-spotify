const SpotifyWebApi   = require('spotify-web-api-node');
const spotify         = new SpotifyWebApi();
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');


app.use(express.static('public'));
app.use(expressLayouts);


// Remember to paste here your credentials
const clientId = '8f1e69c9802e435e997e1983ec9348d0',
    clientSecret = '4037307a11fd4f2ebc93931ea9b99e25';

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

app.get('/', (request, response, next) => {
  response.render('index');
})

// app.get('/artists', (request, response, next) => {
// spotifyApi.searchArtists("The Beatles", {}, (err, data) => {
//   if (err) throw err;
//
//   let artists = data.body.artists.items;
//   console.log(artists)
// });
// });

app.get('/artists', (request, response, next) => {
  spotifyApi.searchArtists(request.query.artists, {}, (err, data) => {
    if (err) throw err;
    let artists = data.body.artists.items;
    response.render('artists',{ artists });
  });
});

app.listen(3000, () => console.log("HEYO"));
