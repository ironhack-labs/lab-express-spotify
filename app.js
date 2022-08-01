require('dotenv').config();

const express = require('express');
const { render } = require('express/lib/response');
const res = require('express/lib/response');
const hbs = require('hbs');



// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
    

// Our routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
})

app.get('/artist-search-results', (req, res, next) => {
    spotifyApi
    .searchArtists(req.query.search)
    .then(data => {
        res.render('artist-search-results', {artists: data.body.artists.items})
        console.log('The received data from the API: ', data.body.artists.items);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistsId', (req, res, next) => {
    spotifyApi
    .getArtistAlbums(req.params.artistsId)
    .then(data => {
        res.render('albums', {albums: data.body.items})
        console.log('Artist albums', data.body.items);
      }) 
      .catch(err => console.log('The error while searching artists occurred: ', err));

  });

  app.get('/track-info/:albumsId', (req, res, next) => {
    spotifyApi
    .getAlbumTracks(req.params.albumsId)
    .then(data => {
        console.log('Track info', data.body.items);
        res.render('track-info', {total_tracks: data.body.items})
      }) 
      .catch(err => console.log('The error while searching artists occurred: ', err));

  });





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
