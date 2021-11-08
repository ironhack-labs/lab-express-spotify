// DOTENV --> Install 'dotenv' to keep APY keys and credentials
require('dotenv').config();
// const dotenv = require('dotenv');

// Require Express to build the server
const express = require('express');
// HBS -> require install 'hbs' --> for layout and views
const hbs = require('hbs');


// Spotify -> require install 'spotify-web-api-node'
const SpotifyWebApi = require('spotify-web-api-node');

// Instantiate the app server
const app = express();

// HBS -> Tell Express the engine use to render views 
app.set('view engine', 'hbs');
// HBS -> Tell Express the folder to find the 'views'
app.set('views', __dirname + '/views');
// Make public folder static and available
app.use(express.static(__dirname + '/public'));

// Spotify -> setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
  
// Spotify ->  Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

  
// Our routes go here:
// Test
app.get('/', async (req, res) => {
    //res.send('hello spotify')
  try {
    const data = await spotifyApi.getAlbum('5U4W9E5WsYb2jUQWePT8Xm');
    console.log('Album information', data.body);
    res.send(data.body);
  }
 catch(err) {
  console.error(err);
  }
});


// Listen for a port
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
