var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path    = require('path');
const bodyparser = require('body-parser')

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname+ '/public'));
hbs.registerPartials(__dirname + '/views/partials')
app.use(bodyparser.urlencoded({ extended: true }));

// Remember to paste here your credentials
var clientId = 'e23ed76a0f0846ab9e0cbbed767f4a91',
    clientSecret = '80b2e226ea814ae4aea7f8a2bea3772d';

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

app.get('/', (req, res, next) => {
  res.render('index');
});

app.post("/artists", (req, res, next) =>{
  const artistSearch = req.body.artist; 
  console.log(req.body)
  spotifyApi.searchArtists(req.body.artist)
    .then(data => {
      console.log("Artist get it", data.body.artists.items);
      data.body.artists.search = artistSearch;
      console.log(data.body.artists.search)
      res.render('artists',data.body.artists);
      
    })
    .catch(err => {
      console.log(err)
    })
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    console.log(data)
    res.render('albums',data.body); 
  })
  .catch(err => {
    console.log(err)
  })
});

app.get('/tracks/:artistId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.artistId)
  .then(data => {
    console.log(data)
    res.render('tracks',data.body); 
  })
  .catch(err => {
    console.log(err)
  })
});

const port = 3000
app.listen(port,()=>{
  console.log(`Ready http://localhost:${port}`)
});