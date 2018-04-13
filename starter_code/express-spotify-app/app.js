const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require("path");
var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '6a9ae57d630e4cd387ae1dac3055570b',
    clientSecret = '7a7015b23dc94a9f9373030c69e40c3b';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});


// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

// Iteration 1

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + "/views/partials");

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/artist', (req, res, next) => {
  let artistName = req.query.artistName;



  spotifyApi.searchArtists(artistName)
    .then(data => {
      const artist = data.body.artists.items;
      console.log(artist)
       res.render('artist', {artist}); 
    })
    .catch(err => {
      console.log(err) 
    })


})





const port = 3000;
app.listen(port, () => console.log(`Connected to ${port}`) );