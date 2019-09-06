    
const express = require('express');
const hbs = require('hbs');
const app = express();

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
require('dotenv').config();

let clientId = '3e2dfc502b8743779c94fe1191ea68ca'
    clientSecret = '926e958b8bdb4ae9bf391155f190adf3'
    access_token = '';

let spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch( err => console.log('Something went wrong when retrieving an access token', err));


// the routes go here:
//home route
app.get('/', (req, res, next) => res.render('home'));

//artist route
app.get('/artists', (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.theArtistName)
    .then(data => {
      res.render('artists', { allTheArtists: data.body.artists.items });})
    .catch(err => console.log("Error while getting the artists: ", err));
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId, { limit: 5 })
  .then(data => {
    res.render('albums', { allTheAlbums: data.body.items });})
  .catch(err => console.log("Error while getting the albums: ", err));
})

app.get('/tracks/:albumId', (req, res, next) => { 
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
      res.render('tracks', { tracks: data.body.items });
    })
    .catch(err => console.log("Error while getting the tracks: ", err));
});


app.listen(3000);
