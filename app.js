require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

// config
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + '/views'));
app.use(express.static(path.join(__dirname + '/public')));

hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
  res.render('index', { docname: 'Home Page'});
})

// get artist(s) and albums
app.get('/artist-search', (req, res) => {
  const artist = req.query.q.toLowerCase()
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      res.render('artist-search-results', { result: data.body.artists.items, doctitle: 'Artist Page' })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

// get albums of the artist
app.get('/albums/:artistId', (req, res, next) => {
  const id = req.params.artistId
  spotifyApi.getArtistAlbums(id)
  .then((data) => {
    console.log('Artist albums', data.body);
    res.render('albums', { albums: data.body.items, doctitle: 'Albums Page'})
  })
  .catch(err => console.log('The error while fetching albums occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
