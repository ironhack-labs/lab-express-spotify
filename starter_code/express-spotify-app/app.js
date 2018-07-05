var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyparser = require('body-parser')
const path = require('path');

app.use(bodyparser.urlencoded({ extended: true }));
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

// Remember to paste here your credentials
var clientId = '706084ac173b445a96a05ab15d8f13d0',
    clientSecret = 'a304a97140cb499bb0948dbbd412291b';

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

   app.get('/artist',(req, res, next) => {
     const artist = req.query.artist; 
     spotifyApi.searchArtists(artist)
     .then(data => {

          res.render('artists',{data:data.body.artists.items});
     })
     .catch(err => {
       console.log(err);
    });
});

app.get('/albums/:artistId', (req, res) => {
     spotifyApi.getArtistAlbums(req.params.artistId)
     .then(data=>{
          console.log(data.body.items)
          res.render('album',{data:data.body.items});
     })
     .catch(err => {
          console.log(err);
       });
   });

   app.get('/tracks/:albumId', (req, res) => {
     console.log(req.params.albumId);
     spotifyApi.getAlbumTracks(req.params.albumId)
     .then(data=>{
          res.render('tracks',{data:data.body.items});
          console.log(data.body.items);
     })
     .catch(err => {
          console.log(err);
       });
   });

app.listen(3000);