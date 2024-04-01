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
    .then(x =>    console.log (clientId))
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

const indexRouter = require('./routes/index');
app.use('/', indexRouter); 

const artistRouter = require('./routes/artists.routes');
app.use('/artist-search', artistRouter ); 

const albumRouter = require('./routes/albums');
app.use('/albums', albumRouter ); 


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
