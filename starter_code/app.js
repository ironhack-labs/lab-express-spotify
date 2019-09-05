const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// Setting the spotify-api goes here:
// (remember to insert your credentials)
const clientId = '66189ab87b734466b6dfc42889e00a7d',
    clientSecret = '90f75fe58a1046deb17b8a293de8c5c6';

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

// The routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artist', (req, res, next) => {
  spotifyApi.searchArtists(req.query.searchArtist)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists);
      res.render('artists', {dataList: data.body.artists});
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
