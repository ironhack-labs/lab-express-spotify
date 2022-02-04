require('dotenv').config();

const express = require('express');
const res = require('express/lib/response');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/styles'));
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
app.get('/', (request, response) => {
  response.render('index');
});

app.get('/artist-search', (request, response) => {
  spotifyApi
  .searchArtists(request.query.artist)
  .then(data => {
    response.render('artist-search-results', {artist: data.body.artists.items })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (request,response,next) => {
  spotifyApi
  .getArtistAlbums(request.params.id)
  .then(data => {
    response.render('albums', {album: data.body.items})
  })
})

app.get('/tracks/:trackId', (request, response, next)=> {
  spotifyApi
  .getAlbumTracks(request.params.trackId)
  .then(data => {
    response.render('tracks', {tracks: data.body.items})
  })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
