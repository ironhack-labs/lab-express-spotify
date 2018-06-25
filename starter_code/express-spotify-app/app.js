const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser');
const logger = require('morgan');
const index = require('./routes/index')

app.use(bodyParser.urlencoded({ extended: true }));
// app.set('views', path.join(__dirname, 'views'));
app.set('views', __dirname + '/views');

app.set('view engine', 'hbs');


//Spotify API
var SpotifyWebApi = require('spotify-web-api-node');

//Credentials used from Spotify API
var clientId = '14d7147057174f6eaaa16194706c1e9f',
    clientSecret = '0e8532d1cfc94b6a90cbd3dde07ac850';

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

//function to search for artists on Spotify
spotifyApi.searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
    .then(data => {
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      // ----> 'HERE WE CAPTURE THE ERROR'
    })

//request for index/homepage
app.get('/', (req,res,next) =>{
  res.render('index');
});

//request for artists
app.get('/artists',  (req,res,next)=>{
  spotifyApi.searchArtists(req.query.artist)
  .then(data=>{
    console.log(data.body.artists);
    let artists = data.body.artists.items;
    res.render('artists', {artists:data.body.artists.items});
  })
  .catch(err => {
   res.send('You have an error:', err);
  });
});

//request for albums
app.get('/albums/:artistId', (req, res, next)=>{
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    let albums = data.body.items;
    res.render('albums', {albums});
  });
  // .catch(err => {
  //   res.send('You have an error:', err);
  // });
});

//request for tracks
app.get('/tracks/:albumId', (req, res, next)=>{
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(data =>{
    let tracks = data.body.items;
    res.render('tracks', {tracks});
  });
  // .catch(err => {
  //   res.send('You have an error:' , err);
  // });
});
    



app.listen(3000, () => console.log('Example app listening on port 3000!'))