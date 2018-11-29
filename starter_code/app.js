const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');

var SpotifyWebApi = require('spotify-web-api-node');

app.use(express.static('public'))


app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "hbs")


const bodyParser = require ('body-parser');
app.use(bodyParser.urlencoded({extented: true}));


// Remember to paste your credentials here
var clientId = '62e6c1dae67f4c69b5e520bd62256eb8',
    clientSecret = '03a82e6158d2466780f08eeebddb378d';

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


app.get('/', function (req, res) {
  res.render('index')
})


app.get('/artists', (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
    .then( data => {
      console.log(data.body.artists.items)
      res.render('artists', {artists: data.body.artists.items})
    })
    .catch(err => {
      console.log(err)
    })
 });


 app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      console.log(data.body.items)
      res.render('albums', {albums: data.body.items})
    })
    .catch(err => {
      console.log(err)
    })
 });








app.listen(3000, () => console.log('Example app listening on port 3000!'))