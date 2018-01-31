'use strict';

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
var SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
// ...


// Remember to paste here your credentials
var clientId = '8365207120cb413d9308393feed75174',
    clientSecret = '6a49c6768b6a4472b070a1dcc4cd2c6f';

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



//configure the app
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(expressLayouts);
// app.use(express.static('public'));

//routes
app.get('/', (req, res, next) => {
		res.render('index');
});

app.post('/artists', (req, res) => {
  let artistSearched = req.body.artist;
  spotifyApi.searchArtists(artistSearched)
  .then(function(result) {
    let data ={
      artistName = result.body.artists.items.
    }
    console.log(artistSearched, result.body.artists.items);
  }, function(err) {
    console.error(err);
  });

});

//start app	
app.listen(3000, () => {
  console.log('Spotify App launched on port 3000!')
});


{ external_urls: 
  { spotify: 'https://open.spotify.com/artist/12Chz98pHFMPJEknJQMWvI' },
 followers: { href: null, total: 3325606 },
 genres: 
  [ 'alternative metal',
    'alternative rock',
    'garage rock',
    'indie rock',
    'modern rock',
    'permanent wave',
    'piano rock',
    'post-grunge',
    'rock' ],
 href: 'https://api.spotify.com/v1/artists/12Chz98pHFMPJEknJQMWvI',
 id: '12Chz98pHFMPJEknJQMWvI',
 images: [ [Object], [Object], [Object] ],
 name: 'Muse',
 popularity: 79,
 type: 'artist',
 uri: 'spotify:artist:12Chz98pHFMPJEknJQMWvI' }
