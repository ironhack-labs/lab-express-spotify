require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:


const app = express();
const PORT = 3000;

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(express.static(__dirname + '/public', { 
    setHeaders: function(res, path, stat) {
      res.set('Content-Type', 'text/css');
    }
  }));

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

// Set up the index route
app.get('/public/styles/style.css', function(req, res) {
    res.sendFile(__dirname + '/public/styles/style.css');
});

app.get('/', (req, res) => {
    res.render('index')
});

app.get('artist-search', (req, res) => {

});















app.listen(PORT, () => console.log(`My Spotify project running on port${PORT} 🎧 🥁 🎸 🔊`));


