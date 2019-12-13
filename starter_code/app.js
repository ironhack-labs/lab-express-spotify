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

spotifyApi
.clientCredentialsGrant()
.then(data => {
  spotifyApi.setAccessToken(data.body['access_token']);
  //console.log(data)
})
.catch(error => {
  console.log('Something went wrong when retrieving an access token', error);
});


// the routes go here:

app.get('/',(request , response) => {
  response.render('index');
});

app.get('/artists',(request , response) => {
  console.log(request.query);
  response.render('artists', request.query);
});

app.get('/albums', (request,response) => {
    spotifyApi.searchArtists(request.query.artist)
    .then((data) => {
      console.log('The received data from the API: ', data.body);
      response.send(data.body);
    })
    .catch(error => {
      console.log('Something went wrong when retrieving an access token', error);
    });
});



// Spotify Artist search






app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
