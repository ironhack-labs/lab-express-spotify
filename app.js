require('dotenv').config();

const express = require('express');
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
    res.render('artist-search')
})

app.get('/artist-search-results', (req, res, next) => {
    const {name} = req.query;
    spotifyApi
    .searchArtists(name)
    .then(data => {
    console.log('The received data from the API: ', data.body);
    res.render('artist-search-results', {artists})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistsId', (req, res, next) => {
    const {artistsId} = req.params;
    spotifyApi
    .searchArtistsAlbums(artistsId)
    .then(data => {
    console.log('The received data from the API: ', data.body);
    res.render('albuns', {albums})
  })
  .catch(err => console.log('The error while searching albums occurred: ', err));
})

app.get('/tracks/:tracksId', (req, res, next) => {
    const {tracksId} = req.params;
    spotifyApi
    .searchAlbumTracks(tracksId)
    .then(data => {
    console.log('The received data from the API: ', data.body);
    res.render('tracks', {tracks})
  })
  .catch(err => console.log('The error while searching albums tracks occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
