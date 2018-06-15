var SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');



// Make everything inside of public/ available
//app.use(express.static('public'));

//home route
app.get('/', (req, res, next) => {
    res.render('index');
  });
//redirecting to artist page
  app.get('/artist', (req, res, next) => {

    spotifyApi.searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })

    res.render('artist');
  });

// Remember to paste here your credentials
var clientId = 'fe587e5a1ff140e390dae5d5380dd400',
    clientSecret = '5a89c7a47a084dca9be0a368a6f376bf';

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





app.listen(3000, () => console.log('Example app listening on port 3000!'))
