const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
//const spotApi = spotify();

// require spotify-web-api-node package here: (DONE)

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Remember to insert your credentials here(DONE)
const clientId = 'e444fad7ca40424989ec62fab7af2ca6',
    clientSecret = 'edc9d1b76faf494f86aeeb52ea3ef144';

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



// setting the spotify-api goes here: ---------------------------


// credentials are optional
// var spotifyApi = new SpotifyWebApi({
//   clientId: 'fcecfc72172e4cd267473117a17cbd4d',
//   clientSecret: 'a6338157c9bb5ac9c71924cb2940e1a7',
//   redirectUri: 'http://www.example.com/callback'
// });




// the routes go here:



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
