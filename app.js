require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:


const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:


app.get('/', (request, response) => { 

    response.render('index', {});

}) 

app.get('/artist-search', (request, response) => { 
  console.log(request.query.artist)

 spotifyApi.searchArtists(request.query.artist)
  .then(function(data) {
    console.log('The received data from the API:', data.body.artists.items[0].images[0].url);

    
  //   // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
 
    response.render('artist-search-results', {artist: data.body.artists.items});
   }).catch(err => console.log(err))

  }) 

app.get('/albums/:artistId', (req, res, next) => {
  console.log(request.params.artistId)

  // .getArtistAlbums() code goes here
  spotifyApi.getArtistAlbums(request.params.artistId).then(
  function(data) {
    console.log('Artist albums', data.body);
  },
  function(err) {
    console.error(err);
  }
);

});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));