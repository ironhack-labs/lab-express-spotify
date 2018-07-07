var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
var clientId = '3ed64250fa4b4023a11d3370763d084e',
    clientSecret = 'c495a84005d04fb3a7dcfc81fceebeea';

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

const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));


//home route
app.get('/', (req, res, next) => {
    res.render('index');
  });

//artist route
  app.get('/artists', (req,res)=>{
    res.render('artists')
});

app.post('/artists', (req,res)=>{
    let artistName = req.body.artistSearch;

    spotifyApi.searchArtists(artistName)
    .then(data => {
      res.render('artists', data);
    })
    .catch(err => {
      res.send(err)
    })
});

//album route
app.get('/albums', (req,res)=>{
    res.render('albums')
});

app.get('/albums/:artistId', (req, res) => {
    var id = req.params.artistId;
    spotifyApi.getArtistAlbums(id)
    .then(data => {
        res.render('albums', data);
    })
    .catch(err => {
        res.send(err)
    })
  });

//tracks route
app.get('/tracks', (req,res)=>{
  res.render('tracks')
});

  app.get('/tracks/:albumId', (req, res) => {
    var id = req.params.albumId;
    spotifyApi.getAlbumTracks(id)
    .then(data => {
        res.render('tracks', data);
    })
    .catch(err => {
        res.send(err)
    })
  });


app.listen(3000);