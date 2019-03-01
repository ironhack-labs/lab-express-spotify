const express = require('express');
const app = express();
const hbs = require('hbs');

// require spotify-web-api-node package here:
// var SpotifyWebApi = require('spotify-web-api-node');



app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// // setting the spotify-api goes here:
// var clientId = '3cfc6511516e4613ab9bb7adbc11345c',
//     clientSecret = '546d8dfaa8ee437580d3ec908e56bb0a';

// var spotifyApi = new SpotifyWebApi({
//   clientId : clientId,
//   clientSecret : clientSecret
// });

// // Retrieve an access token.
// spotifyApi.clientCredentialsGrant()
//   .then(function(data) {
//     spotifyApi.setAccessToken(data.body['access_token']);
//   }, function(err) {
//     console.log('Something went wrong when retrieving an access token', err);
// });



// Middleware
app.use('/', require('./routes/index'))


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
