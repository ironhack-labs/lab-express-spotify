const express = require('express');
const hbs = require('hbs');
const path = require('path');
const musics = require('./routes/musics.routes')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '816e61355d5f4611812b62899793e365',
    clientSecret = 'f60fceb533cb4810b2b66c66a43be5ca';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// the routes go here:
app.use('/', musics);

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
