const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyRouter = require('./routes/spotify.routes');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

const clientId = 'ed3e9ebcc0464804bbae70185122d9cc',
    clientSecret = 'bf5e605f3df440d5b31f1abc2f339912';
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

// the routes go here:

app.use('/main', spotifyRouter);

module.exports = app;

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
