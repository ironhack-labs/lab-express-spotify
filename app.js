require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        //console.log(data);
        spotifyApi.setAccessToken(data.body['access_token'])})
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
    res.render('index');
  });

app.get('/artist-list', (req, res) => {
    console.log(req.query.title);
    spotifyApi.searchArtists(req.query.title)
    .then(function(data) {
      //console.log('Search artists by "Love"', data.body.artists.items[0]);
      res.render('artist-list',{artists : data.body.artists.items})
    }, function(err) {
      console.error(err);
    });
  });

  app.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
      //console.log(req.params.artistId);
      //console.log('Artist albums', data.body.items);
      res.render('albums',{albums: data.body.items})
  }, function(err) {
    console.error(err);
  });
  });

  app.get('/tracks/:albumId',(req,res) => {
    spotifyApi.getAlbumTracks(req.params.albumId, { limit : 5, offset : 1 })
  .then(function(data) {
    console.log(req.params);
    //console.log(data.body);
    res.render('tracks',{tracks: data.body.items})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
  })
  
 




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
