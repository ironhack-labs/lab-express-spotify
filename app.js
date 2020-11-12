require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser') 

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

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

// Home page
app.get('/', (req, res) => res.render('index'))

// Artist-Search
app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artists)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists);
      res.render('artist-search-results', data.body.artists)
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

// Artist-Page
app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      console.log('Artist albums', data.body)
      res.render('albums', data.body)
    })
    .catch(err => console.log('The error while searching artists occurred: ', err))
})

// Tracks-List
app.get('/albums/view-tracks/:albumID', (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumID, { limit: 5, offset: 1})
    .then(data => {
      console.log('Esta es la mandanga', data.body)
      res.render('tracks-list', data.body)
    })
})



// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
