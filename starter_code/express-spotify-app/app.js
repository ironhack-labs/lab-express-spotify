var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const path = require('path')
const app = express();
const hbs = require('hbs');

// Remember to paste here your credentials
var clientId = 'd77d0d3a22154b5ea1ea046a853141a7',
    clientSecret = '72b496c09f8b45b9a8ee71476f571019';

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

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    console.log(req);
    res.render('index');
  });

app.get('/artists', (req,res) => {
       console.log(req.query.artist);
   spotifyApi.searchArtists(req.query.artist)
    .then(data => {
        let artists = data.body.artists.items;
        
        console.log(artists);
        res.render('artist', {artists})
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })
})



app.listen(3000, () => {
    console.log('My first app listening on port 3000!');
  });