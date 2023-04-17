require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }))

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
app.get('/', function(req, res) {
  res.render('index')
})

app.get('/artist-search', function(req, res){
  let searchQuery = req.query.q
  console.log('Search query is: ' + searchQuery)
  spotifyApi
  .searchArtists(searchQuery)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    
    let searchResults = data.body.artists.items
    console.log('The artist is: ', searchResults)
    res.render('artist-search-results', { artists: searchResults})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', function(req, res){
  let artistId = req.params.id 
  spotifyApi.getArtistAlbums(artistId)
  .then(data => {
    console.log('Get Artist Albums Data: ', data.body)
    let albums = data.body.items  
    res.render('albums', {albums: albums})
  })
})

app.get('/tracks/:id', function(req, res){
  let albumsId = req.params.id
  spotifyApi.getAlbumTracks(albumsId)
  .then(data => {
    console.log("Albums Tracks Data: ", data.body)
    let tracks = data.body.items
    res.render('tracks', {tracks: tracks})
  })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
