const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

var Spotify = require('spotify-web-api-js');
var s = new Spotify();
var spotifyApi = new SpotifyWebApi();


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = 'fb9dc24cfc014e4b9b0842ea98275de4',
    clientSecret = '2f44b0604e604c5eaad6e3372e3f853b';

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    })
// the routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
  });
  


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));