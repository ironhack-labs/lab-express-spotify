require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const app = express();

// // require spotify-web-api-node package here:
// const SpotifyWebApi = require('spotify-web-api-node')


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// // setting the spotify-api goes here:
// const spotifyApi = new SpotifyWebApi({
//   clientId: process.env.CLIENT_ID,
//   clientSecret: process.env.CLIENT_SECRET
// });

// // Retrieve an access token
// spotifyApi
//   .clientCredentialsGrant()
//   .then(data => spotifyApi.setAccessToken(data.body['access_token']))
//   .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.use('/', require('./routes/index'))
// same as above 
// const index = require('./routes/index');
// app.use('/', index);  //this down here on bottom
// const would go to top with require to use variable (this ex. not using one)



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
