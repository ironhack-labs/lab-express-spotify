var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + '/views/partials')

hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

// Remember to paste your credentials here
var clientId = '155daa0ed3f04a58835c356525cbc8cf',
    clientSecret = '4b759dd31d74496f8fac6338ec02b159';

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

app.get('/', (req, res) => {

  res.render('index');
  
  });
  
  app.post('/artist' , (req,res) => {
   var artist = req.body.artist;
   console.log(artist);
   spotifyApi.searchArtists(artist)
   .then(data => {
     console.log(data.body.artists.items)
      res.render('artist', {artist: data.body.artists.items})
      // debugger
   })
   .catch(err => {
     // ----> 'HERE WE CAPTURE THE ERROR'
     console.log(err);
   })
  })

  app.get('/albums/:id',(req,res)=>{
    const id = req.params.id;

    spotifyApi.getArtistAlbums(id).then(
      function(data) {
        console.log('Artist albums', data.body);
        res.render("artistAlbum",  {id: data.body})
      },
      function(err) {
        console.error(err);
      }
     );
  })
  app.get('/viewtracks/:id',(req,res)=>{
    const id = req.params.id;

    spotifyApi.getAlbumTracks(id , { limit : 5, offset : 1 })
  .then(function(data) {
    console.log('Artist Tracks', data.body);
    res.render("viewTracks",  {id: data.body})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
 
  })
 app.listen(4100);