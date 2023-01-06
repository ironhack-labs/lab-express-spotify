require('dotenv').config();

//const { response } = require('express');
const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID, // we are getting the information from the .env file
    clientSecret: process.env.CLIENT_SECRET // same thing for the client secret
  });

  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (request, response, next) => {
  response.render('index')
})

app.get('/artist-search', (request, response, next) => {
  spotifyApi.searchArtists(request.query.artist)
  .then((data) => {
    //console.log('The received data from the API: ', data)
    response.render('artist-search-results.hbs', {results:data.body.artists.items})
  })
  .catch((error) => {
    console.log('The error while searching artists occurred: ',error)
  })
})

app.get('/albums/:id', (request, response, next) => { 
  spotifyApi
    .getArtistAlbums(request.params.id)
    .then(data => {
      //console.log('The received data from the API: ', data.body);
      response.render('albums.hbs',{albums:data.body.items});
})
    .catch(error => console.log('The error while searching artists occurred: ', error));

})

app.get('/tracks/:id', (request, response, next) => {
  spotifyApi.getAlbumTracks(request.params.id)
  .then(data => {
    //console.log('The received data from the API: ', data.body);
    response.render('tracks',{tracks:data.body.items});
  })
  .catch(error => console.log('The error while searching tracks occurred: ', error));
})


app.listen(4000, () => console.log('My Spotify project running on port 4000 🎧 🥁 🎸 🔊'));
