const express = require('express');
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node');
const path    = require('path');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + '/views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Remember to paste here your credentials
var clientId = '11390fb233424dd692cfc959be13378f',
    clientSecret = '6675c63dc5aa4eca8414d226a2fabe0c';

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

app.get('/',(req, res, next)=>{
    res.render('index');
});

app.get('/artists',(req, res, next)=>{
    res.render('artists');
});

app.get('/albums',(req, res, next)=>{
    res.render('albums');
});

app.get('/tracks',(req, res, next)=>{
    res.render('tracks');
});

app.post('/artists',(req, res, next)=> {
    console.log(req.body)
    const {artist} = req.body;
    console.log(artist)
    spotifyApi.searchArtists(artist)
    .then(data => {
      const results = data.body.artists.items;
      console.log(results)
      res.render(results);
    //   res.redirect('/artists'); WTF
    })
    .catch(err => {
      console.log(err)
    })
});

app.listen(3000);