
const express = require('express');
const app = express();
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node');
const path = require('path')
const PORT = 3000;


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + "/views/partials")

///////////////////////////////////////////////////////////////////////////////////// ITERATION 1/2

// Remember to paste your credentials here
var clientId = 'a913a0df2d6a4085b1a1e52b724e0973',
    clientSecret = '1e64582cf9eb45b2bc010bb08ce5f7ed';

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

///////////////////////////////////////////////////////////////////////////////////// ITERATION 3
app.get('/',(requ,res,next) => {
  res.render('layout')  
})
app.get('/artist', (req, res, next) => {
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
        const artist = data.body.artists.items;
        res.render('artist', artist);
        console.log(data.name)
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })
  });


/////////////////////////////////////////////////////////////////////////////////////
app.listen(PORT, () =>{
    console.log(PORT);
    
  });
  