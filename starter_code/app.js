const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')
const path = require('path');

const indexRouter= require ('./routes/index');
const artistRouter= require ('./routes/artist');

// require spotify-web-api-node package here:


const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = '25ab3895b3b64d5ab12a89dc682ca9da',
    clientSecret = '2fa0744635ce4ab58eac0fd66da1f403';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


// configurate router:



// the routes go here:

app.use('/', indexRouter);
app.use('/artist', artistRouter);






app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
