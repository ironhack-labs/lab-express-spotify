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
app.get('/', (req, res) => {
    res.render('search-page');
})

//Search request to spotify API

app.get('/artist-search', (req, res) => {

    const searchItem = req.query.artistSearch;

spotifyApi
    .searchArtists(searchItem) 
    .then(data => {
      console.log('The received data from the API: ', data.body);
      res.render ('artist-search-results' , { searchResults: data.body.artists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

// app.get('/artist-search-results', (req, res) => {
//     res.render('artist-search-results');
// })

app.get('/albums/:artistId', (req, res, next) => {

spotifyApi.getArtistAlbums(req.params.artistId)
    .then(function(data) {
      console.log('Artist albums', data.body); //hier kommt das an
      res.render ('albums', {albumResults: data.body.items});
    }, function(err) {
      console.error(err);
    });
});

app.get('/tracks/:trackId', (req, res) => {

spotifyApi.getAlbumTracks(req.params.trackId, { limit : 20, offset : 1 })
  .then(function(data) {
    console.log(data.body);
    res.render ('tracks', {trackResults: data.body.items});
  }, function(err) {
    console.log('Something went wrong!', err);
  });

});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
