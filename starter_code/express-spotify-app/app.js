var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path    = require('path');
// Remember to paste here your credentials
var clientId = 'ab2cdb8975454dcb9ad9c5de6d1e49ac',
    clientSecret = '083b014eccc3415198ab8794360ff285';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', function (req, res) {
    res.render('index')
  })


  app.get('/artists',(req,res)=>{
      let artistName=req.query.artist;
    spotifyApi.searchArtists(artistName)
    .then(data => {
      res.send(`Artist Name: ${artistName}`);
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })
  })

  app.listen(3000, () => console.log('Example app listening on port 3000!'))