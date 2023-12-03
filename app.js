require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const app = express();
const router = require('./routes/routes.js');
const spotifyApi = require('./config/spotify.config');

// require spotify-web-api-node package here:

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.use(router)
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
