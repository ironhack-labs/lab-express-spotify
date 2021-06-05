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

const SpotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  SpotifyApi
    .clientCredentialsGrant()
    .then(data => SpotifyApi.setAccessToken(data.body['52d782522cea4264be089ad1a3645f88']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:


const router = require('./config/routes.config')
app.use('/', router);


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
